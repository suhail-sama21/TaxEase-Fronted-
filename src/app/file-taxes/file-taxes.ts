import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-file-taxes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './file-taxes.html'
})
export class FileTaxesComponent {
  currentStep = 1;
  isSubmitting = false;

  // Form Data
  incomeData = {
    gross: null as number | null,
    deductions: null as number | null,
    other: null as number | null,
    source: ''
  };

  declarations = {
    terms: false,
    accuracy: false
  };

  constructor(private router: Router) {}

  // Dynamic Tax Calculation (10% flat rate for demo)
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

  submitFiling() {
    this.isSubmitting = true;
    // Simulate API POST request to your Submission endpoint
    setTimeout(() => {
      this.isSubmitting = false;
      this.currentStep = 5; // Success screen
    }, 1500);
  }

  goToPayment() {
    this.router.navigate(['/payment']);
  }
}