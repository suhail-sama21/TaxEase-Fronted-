import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Interface matching com.cognizant.taxFilingService.dto.requestdto.TaxFilingRequestDTO
export interface TaxFilingRequestDTO {
  taxpayerId: number;
  period: string;
  amountDeclared: number; // Maps to BigDecimal in Java
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

  // Constants to match Backend constraints (Regex: ^FY\d{4}-\d{2}$)
  readonly taxpayerId = 987654321;
  readonly period = "FY2025-26";

  declarations = {
    terms: false,
    accuracy: false
  };

  constructor(private router: Router) {}

  // Calculation for the amountDeclared field
  get taxableIncome(): number {
    const g = this.incomeData.gross || 0;
    const d = this.incomeData.deductions || 0;
    const o = this.incomeData.other || 0;
    return Math.max(0, g - d + o);
  }

  get taxDue(): number {
    return this.taxableIncome * 0.10; // 10% Flat Rate logic
  }

  nextStep() {
    if (this.currentStep < 5) this.currentStep++;
  }

  prevStep() {
    if (this.currentStep > 1) this.currentStep--;
  }

  submitFiling() {
    this.isSubmitting = true;

    // Construct the DTO for the Backend API
    const filingRequest: TaxFilingRequestDTO = {
      taxpayerId: this.taxpayerId,
      period: this.period,
      amountDeclared: this.taxableIncome
    };

    console.log("Submitting to /api/filings/submit:", filingRequest);

    // Simulate the TaxFilingController response
    setTimeout(() => {
      this.isSubmitting = false;
      this.generatedFilingId = Math.floor(Math.random() * 5000) + 100;
      this.filingStatus = "Pending"; // Default status from Entity
      this.currentStep = 5;
    }, 1500);
  }

  goToPayment() {
    this.router.navigate(['/payment']);
  }
}
