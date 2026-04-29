import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-compliance',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-compliance.html'
})
export class CreateComplianceComponent {

  // Form State matching the new structure
  formData = {
    taxpayerId: '',
    complianceType: '',
    result: '',
    filingId: '',
    paymentId: '',
    notes: ''
  };

  // Handle clearing fields when the type changes
  onTypeChange() {
    if (this.formData.complianceType === 'Filing') {
      this.formData.paymentId = ''; // Clear payment ID if Filing is selected
    } else if (this.formData.complianceType === 'Payment') {
      this.formData.filingId = ''; // Clear filing ID if Payment is selected
    } else {
      this.formData.paymentId = '';
      this.formData.filingId = '';
    }
  }

  // Basic validation rule for the submit button
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
    if (this.isFormValid()) {
      alert(`Compliance Record created successfully for Taxpayer ID: ${this.formData.taxpayerId}`);
      // In the future, this is where you call: POST /api/compliance
    }
  }

  cancel() {
    // Reset the form
    this.formData = {
      taxpayerId: '',
      complianceType: '',
      result: '',
      filingId: '',
      paymentId: '',
      notes: ''
    };
  }
}
