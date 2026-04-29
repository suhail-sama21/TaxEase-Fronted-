import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-report-download',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report-download.html'
})
export class ReportDownloadComponent {
  
  // Form variables
  startDate: string = '';
  endDate: string = '';
  reportType: string = 'Revenue';

  metrics = {
    totalVolume: false,
    successRate: false,
    failureReasons: false,
    auditFindings: false
  };

  // PUDHUSA ADD PANNATHU: Mock Data for Recent Reports Table
  recentReports = [
    { id: 'REP-0091', name: 'Q1 2026 Revenue Summary', category: 'Revenue', date: '2026-04-20', status: 'Ready', statusColor: 'green' },
    { id: 'REP-0092', name: 'Failed Transactions Log', category: 'Payments', date: '2026-04-18', status: 'Ready', statusColor: 'green' },
    { id: 'REP-0093', name: 'Q1 Audit Discrepancies', category: 'Audit', date: '2026-04-15', status: 'Expired', statusColor: 'amber' },
    { id: 'REP-0094', name: 'Custom Revenue Export', category: 'Revenue', date: 'Just now', status: 'Generating', statusColor: 'blue' }
  ];

  downloadReport() {
    const selectedMetrics = Object.keys(this.metrics).filter(key => (this.metrics as any)[key]);

    if (selectedMetrics.length === 0) {
      alert("Please select at least one metric!");
      return;
    }

    alert('Report generation initiated! It will appear in your history shortly.');
  }
}