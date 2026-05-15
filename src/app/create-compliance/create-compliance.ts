import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // <-- To navigate after success
import { ComplianceService } from '../core/services/compliance.service';
import { CreateComplianceRequest } from '../models/compliance.model';

@Component({
  selector: 'app-create-compliance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-compliance.html'
})
export class CreateComplianceComponent {

  formData = {
    taxpayerId: '',
    complianceType: '',
    result: '',
    filingId: '',
    paymentId: '',
    notes: ''
  };

  // Add states for loading and errors
  isLoading = false;
  errorMessage = '';

  // Inject the service and router
  constructor(
    private complianceService: ComplianceService,
    private router: Router
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
    this.errorMessage = ''; // Clear old errors

    // Map the form data to exactly what Spring Boot expects
    const requestPayload: CreateComplianceRequest = {
      taxpayerId: Number(this.formData.taxpayerId), // Convert string to number
      type: this.formData.complianceType,           // Map 'complianceType' to 'type'
      result: this.formData.result,
      notes: this.formData.notes,

      // Only attach Filing ID if type is Filing
      filingId: this.formData.complianceType === 'Filing' ? Number(this.formData.filingId) : null,

      // Only attach Payment ID if type is Payment
      paymentId: this.formData.complianceType === 'Payment' ? Number(this.formData.paymentId) : null
    };

    // Make the API Call
    this.complianceService.createCompliance(requestPayload).subscribe({
      next: (response) => {
        this.isLoading = false;
        alert('Compliance Record created successfully!');
        // Redirect the user to the dashboard (or records table) upon success
        this.router.navigate(['/portal/compliance-dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error creating compliance record:', err);
        // Display the specific error message thrown by your Java backend if available
        this.errorMessage = err.error?.message || 'Failed to create record. Please check the IDs provided.';
      }
    });
  }

  cancel() {
    // Reset the form
    this.formData = { taxpayerId: '', complianceType: '', result: '', filingId: '', paymentId: '', notes: '' };
    this.errorMessage = '';
  }
}
