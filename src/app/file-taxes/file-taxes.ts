import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaxFilingService } from '../service/tax-filing.service';
import { TaxpayerService } from '../service/taxpayer-service';
import { Store } from '@ngrx/store';
import { selectUser } from '../stores/authStore/auth.features';
import { Observable , of} from 'rxjs';
import { OnInit } from '@angular/core';

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
export class FileTaxesComponent implements OnInit{
  currentStep = 1;
  isSubmitting = false;
  submissionMessage: string = '';

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

  // ADDING 'private' HERE IS CRITICAL
  constructor(
    private router: Router,
    private taxFilingService: TaxFilingService,
    private cdr: ChangeDetectorRef,
    private taxpayerService: TaxpayerService,
    private store: Store
  ){
    //let id:number;
     
  }
  ngOnInit(){
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

  nextStep() { if (this.currentStep < 5) this.currentStep++; }
  prevStep() { if (this.currentStep > 1) this.currentStep--; }

  resetForm() {
    this.currentStep = 1;
    this.isSubmitting = false;
    this.submissionMessage = '';
    this.incomeData = { gross: null, deductions: 0, other: 0 };
    this.declarations = { terms: false, accuracy: false };
    this.generatedFilingId = null;
  }

  submitFiling() {
    console.log("File Taxes Component Initialized with taxpayerId:", this.taxpayerId);
    if (this.isSubmitting) return;

    this.isSubmitting = true;
    this.submissionMessage = 'Processing your request...';

    const filingRequest = {
      taxpayerId: Number(this.taxpayerId),
      period: this.period,
      amountDeclared: Number(this.taxableIncome.toFixed(2))
    };

    this.taxFilingService.submitFiling(filingRequest).subscribe({
      next: (res) => {
        console.log("Response Received:", res);

        this.generatedFilingId = res.id;
        this.filingStatus = res.status || 'Pending';
        this.submissionMessage = 'Submission Successful!';

        // Update state
        this.currentStep = 5;
        this.isSubmitting = false;

        // Trigger UI refresh
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error("Backend Error:", err);
        this.isSubmitting = false;
        this.submissionMessage = err.error?.message || 'Submission failed.';
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
