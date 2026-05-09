import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // <-- Imported ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuditService } from '../services/audit.service';
import { AuditResponse, CloseAuditRequest } from '../models/audit.model';
import { Observable, tap } from 'rxjs';

@Component({
  selector: 'app-view-audit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-audit.html',
})
export class ViewAuditComponent implements OnInit {
  auditData$!: Observable<AuditResponse>;
  currentAuditId!: number;
  isClosingAudit = false;
  closeRequest: CloseAuditRequest = { findings: '' };

  // Message state variables
  successMessage = '';
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auditService: AuditService,
    private cdr: ChangeDetectorRef, // <-- Injected ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.currentAuditId = Number(idParam);
      this.auditData$ = this.auditService
        .getAuditById(this.currentAuditId)
        .pipe(tap((data) => console.log('Stream received data:', data)));
    } else {
      this.router.navigate(['/portal/audit-cases']);
    }
  }

  initiateClose() {
    this.isClosingAudit = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  cancelClose() {
    this.isClosingAudit = false;
    this.closeRequest.findings = '';
    this.errorMessage = '';
    this.successMessage = '';
  }

  submitCloseAudit() {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.closeRequest.findings.trim()) {
      this.errorMessage = 'Findings are required to close the case.';
      return;
    }

    // Call the service to update status and navigate on success
    this.auditService.closeAudit(this.currentAuditId, this.closeRequest).subscribe({
      next: (res) => {
        // Set on-screen success message instead of alert
        this.successMessage = `Audit AUD-${res.id} has been closed successfully.`;
        this.isClosingAudit = false;

        // Delay navigation so the user can read the green message
        setTimeout(() => {
          this.router.navigate(['/portal/audit-cases']);
        }, 1500);
      },
      error: (err) => {
        console.error('Close Audit Failed:', err);

        // Safely extract backend error message
        if (err.error && typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else if (err.error && err.error.message) {
          this.errorMessage = err.error.message;
        } else {
          this.errorMessage = 'Failed to close audit. Please check your backend connection.';
        }

        // Force UI refresh instantly
        this.cdr.detectChanges();
      },
    });
  }

  // Final single implementation of goBack
  goBack() {
    this.router.navigate(['/portal/audit-cases']);
  }
}
