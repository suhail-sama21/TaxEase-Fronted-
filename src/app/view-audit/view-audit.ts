import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-audit',
  standalone: true,
  imports: [CommonModule, FormsModule], // <-- Add FormsModule here
  templateUrl: './view-audit.html',
})
export class ViewAuditComponent {
  // Mock data
  auditData = {
    id: 1042,
    officerId: 4001,
    scope:
      'Q2 2026 Corporate Tax Filings for Tech Sector, specifically focusing on R&D credit claims exceeding $50,000.',
    findings:
      'Initial review indicates 3 out of 15 selected filings have missing supporting documentation for R&D vendor expenses. Follow-up requested via taxpayer portal.',
    status: 'ACTIVE',
    createdAt: '2026-04-28T14:30:00Z',
  };

  // --- NEW: State for Closing Workflow ---
  isClosingAudit: boolean = false;
  closeRequest = {
    findings: '',
  };

  getFormattedDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  goBack() {
    alert('Navigating back to Audit Cases list...');
  }

  editFindings() {
    alert(`Opening edit modal for Audit ID: ${this.auditData.id}`);
  }

  // --- NEW: Closing Methods ---

  // Toggles the closing form
  initiateClose() {
    this.isClosingAudit = true;
    // Pre-fill with existing findings, or leave blank. Let's start fresh for final remarks.
    this.closeRequest.findings = '';

    // Smooth scroll down to the form
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  }

  cancelClose() {
    this.isClosingAudit = false;
    this.closeRequest.findings = '';
  }

  submitCloseAudit() {
    if (this.closeRequest.findings.trim() === '') {
      alert('Findings cannot be empty.');
      return;
    }
    if (this.closeRequest.findings.length > 2000) {
      alert('Findings cannot exceed 2000 characters.');
      return;
    }

    // Here you would call: PUT /api/audit/{id}/close with this.closeRequest

    alert(`Audit ${this.auditData.id} has been successfully closed.`);

    // Update local state to reflect changes
    this.auditData.status = 'CLOSED';

    // Append final findings to existing findings for the record
    this.auditData.findings += '\n\n--- FINAL CLOSURE NOTES ---\n' + this.closeRequest.findings;

    this.isClosingAudit = false;
  }
}
