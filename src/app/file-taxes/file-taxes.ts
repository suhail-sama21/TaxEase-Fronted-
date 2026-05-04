import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaxFilingService } from '../service/tax-filing.service'; // Ensure this path is correct

// Interface matching com.cognizant.taxFilingService.dto.requestdto.TaxFilingRequestDTO
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
export class FileTaxesComponent {
  currentStep = 1;
  isSubmitting = false;

  // Variables for response display
  generatedFilingId: number | null = null;
  filingStatus: string = '';

  // Form Data
  incomeData = {
    gross: null as number | null,
    deductions: null as number | null,
    other: null as number | null
  };

  // Constants to match Backend constraints
  readonly taxpayerId = 987654321;
  readonly period = "FY2025-26";

  declarations = {
    terms: false,
    accuracy: false
  };

  // Inject the service in the constructor
  constructor(
    private router: Router,
    private taxFilingService: TaxFilingService
  ) {}

  // Calculation for the amountDeclared field
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
    if (this.currentStep < 5) this.currentStep++;
  }

  prevStep() {
    if (this.currentStep > 1) this.currentStep--;
  }

  // FIXED: Single, clean method calling the backend service
  submitFiling() {
    this.isSubmitting = true;

    const filingRequest: TaxFilingRequestDTO = {
      taxpayerId: this.taxpayerId,
      period: this.period,
      amountDeclared: this.taxableIncome
    };

    console.log("Submitting to /api/filings/submit:", filingRequest);

    this.taxFilingService.submitFiling(filingRequest).subscribe({
      next: (res) => {
        // 'res' here is the TaxFilingResponseDTO from your Java Backend
        this.generatedFilingId = res.id;
        this.filingStatus = res.status;
        this.currentStep = 5; // Move to the success step
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error("Submission failed:", err);
        this.isSubmitting = false;
        alert("There was an error submitting your taxes. Please check the console.");
      }
    });
  }

  goToPayment() {
    // Navigating to the payment route with the generated ID
    this.router.navigate(['/portal/payment'], {
      queryParams: { id: this.generatedFilingId, amount: this.taxDue }
    });
  }
}
