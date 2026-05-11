import { Component, OnInit } from '@angular/core';
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auditService: AuditService,
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
  }

  cancelClose() {
    this.isClosingAudit = false;
    this.closeRequest.findings = '';
  }

  submitCloseAudit() {
    if (!this.closeRequest.findings.trim()) {
      alert('Findings are required to close the case.');
      return;
    }

    // Call the service to update status and navigate on success
    this.auditService.closeAudit(this.currentAuditId, this.closeRequest).subscribe({
      next: (res) => {
        alert(`Audit AUD-${res.id} has been closed successfully.`);
        this.isClosingAudit = false;

        // Directly navigate back to dashboard
        this.router.navigate(['/portal/audit-cases']);
      },
      error: (err) => {
        console.error('Close Audit Failed:', err);
        alert('Failed to close audit. Please try again.');
      },
    });
  }

  // Final single implementation of goBack
  goBack() {
    this.router.navigate(['/portal/audit-cases']);
  }
}
