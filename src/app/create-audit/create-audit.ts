import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-audit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-audit.html'
})
export class CreateAuditComponent {

  // Maps directly to your Spring Boot Audit entity
  formData = {
    officerId: '', // Usually auto-filled from auth token in prod, but manual for now
    scope: '',
    findings: '',
    status: 'PENDING'
  };

  isFormValid(): boolean {
    return !!(this.formData.officerId && this.formData.scope && this.formData.status);
  }

  createAudit() {
    if (this.isFormValid()) {
      alert(`Audit Record created successfully for Officer ID: ${this.formData.officerId}`);
      // In the future, this is where you call: POST /api/audit
    }
  }

  cancel() {
    // Reset the form
    this.formData = {
      officerId: '',
      scope: '',
      findings: '',
      status: 'PENDING'
    };
  }
}
