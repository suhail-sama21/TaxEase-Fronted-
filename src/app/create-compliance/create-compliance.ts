import { Component, ChangeDetectorRef } from '@angular/core'; // <-- Add it here
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ComplianceService } from '../services/compliance.service';
import { CreateComplianceRequest } from '../models/compliance.model';

@Component({
  selector: 'app-create-compliance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-compliance.html',
})
export class CreateComplianceComponent {
  formData = {
    taxpayerId: '',
    complianceType: '',
    result: '',
    filingId: '',
    paymentId: '',
    notes: '',
  };

  // Add states for loading and messages
  isLoading = false;
  errorMessage = '';
  successMessage = ''; // <-- Added success message variable

  constructor(
    private complianceService: ComplianceService,
    private router: Router,
    private cdr: ChangeDetectorRef, // <-- Add this line
  ) {}

  onTypeChange() {
    if (this.formData.complianceType === 'Filing') {
      this.formData.paymentId = '';
    } else if (this.formData.complianceType === 'Payment') {
      this.formData.filingId = '';
    } else {
      this.formData.paymentId = '';
      this.formData.filingId = '';
    }
  }

  isFormValid(): boolean {
    if (!this.formData.taxpayerId || !this.formData.complianceType || !this.formData.result) {
      return false;
    }
    if (this.formData.complianceType === 'Filing' && !this.formData.filingId) {
      return false;
    }
    if (this.formData.complianceType === 'Payment' && !this.formData.paymentId) {
      return false;
    }
    return true;
  }

  createRecord() {
    if (!this.isFormValid()) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const requestPayload: CreateComplianceRequest = {
      taxpayerId: Number(this.formData.taxpayerId),
      type: this.formData.complianceType,
      result: this.formData.result,
      notes: this.formData.notes,
      filingId: this.formData.complianceType === 'Filing' ? Number(this.formData.filingId) : null,
      paymentId:
        this.formData.complianceType === 'Payment' ? Number(this.formData.paymentId) : null,
    };

    this.complianceService.createCompliance(requestPayload).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.successMessage = 'Compliance Record created successfully!';

        setTimeout(() => {
          this.router.navigate(['/portal/compliance-dashboard']);
        }, 1500);
      },
      error: (err) => {
        // 1. Turn off loading
        this.isLoading = false;
        console.error('Error creating compliance record:', err);

        // 2. Set the error message
        if (err.error && typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else if (err.status === 404) {
          this.errorMessage = `Entered data not found in Taxpayer Service`;
        } else if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Failed to create record. Please check your backend connection.';
        }

        // 3. THE FIX: Force Angular to update the UI instantly!
        this.cdr.detectChanges();
      },
    });
  }

  cancel() {
    this.formData = {
      taxpayerId: '',
      complianceType: '',
      result: '',
      filingId: '',
      paymentId: '',
      notes: '',
    };
    this.errorMessage = '';
    this.successMessage = '';
  }
}
