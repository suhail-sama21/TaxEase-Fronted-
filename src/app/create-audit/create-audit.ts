import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuditService } from '../services/audit.service';
import { CreateAuditRequest } from '../models/audit.model';

@Component({
  selector: 'app-create-audit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-audit.html',
})
export class CreateAuditComponent {
  formData = {
    officerId: '',
    taxpayerId: '',
    scope: '',
    findings: '',
  };

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private auditService: AuditService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  isFormValid(): boolean {
    return !!(this.formData.officerId && this.formData.taxpayerId && this.formData.scope.trim());
  }

  createRecord() {
    if (!this.isFormValid()) return;

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const payload: CreateAuditRequest = {
      officerId: Number(this.formData.officerId),
      taxpayerId: Number(this.formData.taxpayerId),
      scope: this.formData.scope,
      findings: this.formData.findings || undefined,
    };

    this.auditService.createAudit(payload).subscribe({
      next: (response) => {
        this.isLoading = false;

        this.successMessage = `Audit Record created successfully with ID: AUD-${response.id}`;

        setTimeout(() => {
          this.router.navigate(['/portal/audit-cases']);
        }, 1500);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error creating audit:', err);

        if (err.error && typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else if (err.status === 404) {
          this.errorMessage = 'Officer ID or Taxpayer ID not found in the system.';
        } else if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Failed to create audit record. Please verify the IDs provided.';
        }

        this.cdr.detectChanges();
      },
    });
  }

  cancel() {
    this.formData = { officerId: '', taxpayerId: '', scope: '', findings: '' };
    this.errorMessage = '';
    this.successMessage = '';
  }
}
