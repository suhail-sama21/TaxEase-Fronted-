import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportingService } from '../../core/services/reporting.service';

@Component({
  selector: 'app-report-download',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './report-download.html'
})
export class ReportDownloadComponent {
  
  // Form variables bonded to your HTML [(ngModel)]
  startDate: string = '';
  endDate: string = '';
  
  // Default Category (This is just for the CSV file name)
  reportType: string = 'Financial';

  // Simplified Metrics directly matching your backend endpoint!
  metrics = {
    revenue: true,      // Default checked
    compliance: false   // Default unchecked
  };

  isGenerating: boolean = false;
  recentReports: any[] = [];

  constructor(private reportingService: ReportingService) {}

  downloadReport() {
    // 1. Validation
    if (!this.startDate || !this.endDate) {
      alert("Please select both Start Date and End Date!");
      return;
    }

    // 2. Build backend array based on exact checkboxes
    const backendMetrics: string[] = [];
    
    if (this.metrics.revenue) {
      backendMetrics.push("Revenue");
    }
    if (this.metrics.compliance) {
      backendMetrics.push("Compliance");
    }

    if (backendMetrics.length === 0) {
      alert("Please select at least one data metric (Revenue or Compliance)!");
      return;
    }

    this.isGenerating = true;

    // 3. Call the backend API
    this.reportingService.downloadCustomReport(this.startDate, this.endDate, this.reportType, backendMetrics)
      .subscribe({
        next: (blob: Blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `TaxEase_${this.reportType}_Report_${this.startDate}.csv`;
          document.body.appendChild(a);
          a.click();
          
          window.URL.revokeObjectURL(url);
          a.remove();

          this.recentReports.unshift({ 
            id: 'REP-' + Math.floor(1000 + Math.random() * 9000), 
            name: `${this.reportType} Extract`, 
            category: this.reportType, 
            date: new Date().toISOString().split('T')[0], 
            status: 'Ready', 
            statusColor: 'green' 
          });

          this.isGenerating = false;
        },
        error: (err: any) => {
          console.error('Error generating report:', err);
          alert('Failed to generate report. Check your date range or backend connection.');
          this.isGenerating = false;
        }
      });
  }
}