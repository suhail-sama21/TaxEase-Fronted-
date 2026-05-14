import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuditService } from '../core/services/audit.service';
import { CreateAuditRequest } from '../models/audit.model';

@Component({
  selector: 'app-create-audit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-audit.html',
})
export class CreateAuditComponent {
  // State matching the backend DTO exactly, now including taxpayerId
  formData = {
    officerId: '',
    taxpayerId: '', // <-- ADDED TARGET TAXPAYER ID
    scope: '',
    findings: '',
  };

  isLoading = false;
  errorMessage = '';

  constructor(
    private auditService: AuditService,
    private router: Router,
  ) {}

  // Basic validation: Officer ID, Taxpayer ID, and Scope are required
  isFormValid(): boolean {
    return !!(this.formData.officerId && this.formData.taxpayerId && this.formData.scope.trim());
  }

  createRecord() {
    if (!this.isFormValid()) return;

    this.isLoading = true;
    this.errorMessage = ''; // Clear previous errors

    // Map the string inputs to the exact types expected by Java
    const payload: CreateAuditRequest = {
      officerId: Number(this.formData.officerId),
      taxpayerId: Number(this.formData.taxpayerId), // <-- MAPPED TO PAYLOAD
      scope: this.formData.scope,
      findings: this.formData.findings || undefined, // Send undefined if empty
    };

    // Make the API Call
    this.auditService.createAudit(payload).subscribe({
      next: (response) => {
        this.isLoading = false;
        alert(`Audit Record created successfully with ID: ${response.id}`);

        // Redirect to the Dashboard/Cases page
        this.router.navigate(['/portal/audit-cases']); // Note: Updated to route to audit-cases table!
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error creating audit:', err);
        // Safely display backend error messages
        this.errorMessage =
          err.error?.message || 'Failed to create audit record. Please verify the IDs provided.';
      },
    });
  }

  cancel() {
    this.formData = { officerId: '', taxpayerId: '', scope: '', findings: '' };
    this.errorMessage = '';
  }
}
