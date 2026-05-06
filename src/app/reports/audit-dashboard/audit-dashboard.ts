import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { ReportingService, AuditDashboardResponse, AuditDto } from '../../services/reporting.service';

@Component({
  selector: 'app-audit-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './audit-dashboard.html'
})
export class AuditDashboardComponent implements OnInit {
  
  // Dynamic Top Card Variables
  totalAudits: number = 0;
  passedAudits: number = 0;
  flaggedCases: number = 0;
  pendingReviews: number = 0;

  completedAudits: any[] = [];

  constructor(
    private reportingService: ReportingService,
    private cdr: ChangeDetectorRef // Forces UI updates immediately
  ) {}

  ngOnInit() {
    this.loadDashboardData();
    this.loadCompletedAudits();
  }

  loadDashboardData() {
    this.reportingService.getAuditDashboard().subscribe({
      next: (data: AuditDashboardResponse) => {
        
        this.totalAudits = data.totalAudits;
        this.flaggedCases = data.nonComplianceFilings;
        this.pendingReviews = data.openAudits;
        
        // Calculate Passed Audits (Total Closed minus the ones flagged for Non-Compliance)
        this.passedAudits = Math.max(0, data.closedAudits - data.nonComplianceFilings);

        // Update Doughnut Chart Data dynamically
        this.statusChartData.datasets[0].data = [this.passedAudits, this.flaggedCases, this.pendingReviews];
        this.statusChartData = { ...this.statusChartData }; // Trick to redraw chart

        this.cdr.detectChanges(); // Update HTML
      },
      error: (err: any) => console.error('[Audit Dashboard API] Error:', err)
    });
  }

  loadCompletedAudits() {
    this.reportingService.getCompletedAudits().subscribe({
      next: (audits: AuditDto[]) => {
        
        // 1. Map backend Audit data to HTML Table format
        this.completedAudits = audits.map(audit => ({
          auditId: 'AUD-' + audit.id,
          taxpayerName: audit.scope, // Using scope as a proxy since taxpayer name isn't directly in Audit
          auditDate: new Date(audit.createdAt).toLocaleDateString(),
          status: audit.status === 'Inactive' ? 'Closed' : audit.status,
          findings: audit.findings,
          statusColor: audit.findings && audit.findings.toLowerCase().includes('issue') ? 'red' : 'green'
        }));

        // 2. Generate Bar Chart Data dynamically (Group by Month)
        const monthCounts = [0, 0, 0, 0]; // Representing Jan, Feb, Mar, Apr
        
        audits.forEach(audit => {
          if (audit.createdAt) {
            const month = new Date(audit.createdAt).getMonth(); // 0 = Jan, 1 = Feb, etc.
            if (month >= 0 && month <= 3) {
              monthCounts[month]++;
            }
          }
        });

        this.volumeChartData.datasets[0].data = monthCounts;
        this.volumeChartData = { ...this.volumeChartData }; // Trick to redraw chart

        this.cdr.detectChanges(); // Update HTML
      },
      error: (err: any) => console.error('[Completed Audits API] Error:', err)
    });
  }

  // --- CHART CONFIGURATIONS ---

  // Universal Theme Doughnut Chart
  public statusChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Passed', 'Flagged', 'Under Review'],
    datasets: [{
      data: [0, 0, 0], // Dynamically updated
      backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
      borderWidth: 0 
    }]
  };

  public statusChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right', labels: { color: '#8b949e', padding: 20 } }
    },
    cutout: '75%' 
  };

  // Universal Theme Bar Chart
  public volumeChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr'],
    datasets: [{ 
      data: [0, 0, 0, 0], // Dynamically updated
      label: 'Audits Conducted', 
      backgroundColor: '#2563eb', 
      borderRadius: 6
    }]
  };

  public volumeChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: 'rgba(139, 148, 158, 0.2)' }, ticks: { color: '#8b949e' } },
      y: { grid: { color: 'rgba(139, 148, 158, 0.2)' }, ticks: { color: '#8b949e' } }
    }
  };
}