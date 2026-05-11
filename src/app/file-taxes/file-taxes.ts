import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaxFilingService } from '../service/tax-filing.service';
import { Store } from '@ngrx/store';
import { selectUser } from '../stores/authStore/auth.features';

export interface TaxFilingRequestDTO {
  taxpayerId: number;
  period: string;
  amountDeclared: number;
}

@Component({
  selector: 'app-file-taxes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './file-taxes.html'
})
export class FileTaxesComponent implements OnInit {
  currentStep = 1;
  isSubmitting = false;
  submissionError: string = '';

  generatedFilingId: number | null = null;
  filingStatus: string = '';

  incomeData = {
    gross: null as number | null,
    deductions: 0 as number,
    other: 0 as number
  };

  taxpayerId: number= 0;
  readonly period = "FY2025-26";

  declarations = {
    terms: false,
    accuracy: false
  };

  constructor(
    private router: Router,
    private taxFilingService: TaxFilingService,
    private cdr: ChangeDetectorRef,
    private store: Store
  ){
    //let id:number;
    this.store.select(selectUser).subscribe(user => {
      if(user){
        //id =user.id
         this.taxpayerId = user.id;
      }
    })
  }


  get taxableIncome(): number {
    const g = this.incomeData.gross || 0;
    const d = this.incomeData.deductions || 0;
    const o = this.incomeData.other || 0;
    return Math.max(0, g - d + o);
  }

  get taxDue(): number {
    return this.taxableIncome * 0.10;
  }

  nextStep() {
    this.submissionError = '';
    if (this.currentStep < 5) this.currentStep++;
  }

  prevStep() {
    this.submissionError = '';
    if (this.currentStep > 1) this.currentStep--;
  }

  resetForm() {
    this.currentStep = 1;
    this.isSubmitting = false;
    this.submissionError = '';
    this.incomeData = { gross: null, deductions: 0, other: 0 };
    this.declarations = { terms: false, accuracy: false };
    this.generatedFilingId = null;
    this.cdr.detectChanges();
  }

  submitFiling() {
    console.log("File Taxes Component Initialized with taxpayerId:", this.taxpayerId);
    this.submissionError = '';

    // Validation checks
    if (!this.incomeData.gross || this.incomeData.gross <= 0) {
      this.submissionError = 'Error: Please enter a valid gross income amount.';
      this.cdr.detectChanges();
      return;
    }

    if (this.incomeData.deductions < 0) {
      this.submissionError = 'Error: Deductions cannot be negative.';
      this.cdr.detectChanges();
      return;
    }

    if (this.incomeData.deductions > this.incomeData.gross) {
      this.submissionError = 'Error: Deductions cannot exceed gross income.';
      this.cdr.detectChanges();
      return;
    }

    if (!this.declarations.accuracy) {
      this.submissionError = 'Error: Please confirm the accuracy of your information.';
      this.cdr.detectChanges();
      return;
    }

    if (!this.declarations.terms) {
      this.submissionError = 'Error: Please agree to the terms of service.';
      this.cdr.detectChanges();
      return;
    }

    if (this.isSubmitting) return;

    this.isSubmitting = true;
    this.submissionError = '';
    this.cdr.detectChanges();

    const filingRequest: TaxFilingRequestDTO = {
      taxpayerId: Number(this.taxpayerId),
      period: this.period,
      amountDeclared: Number(this.taxableIncome.toFixed(2))
    };

    this.taxFilingService.submitFiling(filingRequest).subscribe({
      next: (res) => {
        console.log("Response Received:", res);

        this.generatedFilingId = res.id;
        this.filingStatus = res.status || 'Pending';
        this.submissionError = '';

        // Update state
        this.currentStep = 5;
        this.isSubmitting = false;

        // Trigger UI refresh
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Backend Error:", err);
        this.isSubmitting = false;

        // Handle specific error cases
        if (err.status === 400) {
          this.submissionError = 'Error: Invalid data provided. Please check your entries and try again.';
        } else if (err.status === 409) {
          this.submissionError = 'Error: A filing for this period already exists. Please contact support.';
        } else if (err.status === 422) {
          this.submissionError = 'Error: Invalid taxable income. Please ensure deductions do not exceed gross income.';
        } else if (err.status === 0) {
          this.submissionError = 'Error: Network error. Please check your internet connection and try again.';
        } else if (err.status === 500 || err.status === 503) {
          this.submissionError = 'Error: Server error. Please try again later.';
        } else if (err.error?.message) {
          this.submissionError = `Error: ${err.error.message}`;
        } else {
          this.submissionError = 'Error: Failed to submit your filing. Please try again later.';
        }

        this.cdr.detectChanges();
      }
    });
  }

  goToPayment() {
    this.router.navigate(['/portal/payment'], {
      queryParams: { id: this.generatedFilingId, amount: this.taxDue }
    });
  }
}
