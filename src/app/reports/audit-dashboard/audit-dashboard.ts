import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-audit-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './audit-dashboard.html'
})
export class AuditDashboardComponent {
  
  totalAudits: number = 156;
  passedAudits: number = 142;
  flaggedCases: number = 14;
  pendingReviews: number = 8;

  // Universal Theme Doughnut Chart
  public statusChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Passed', 'Flagged', 'Under Review'],
    datasets: [{
      data: [142, 14, 8],
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
      data: [25, 32, 45, 54], 
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

  completedAudits = [
    { auditId: 'AUD-2026-001', taxpayerName: 'TechCorp Inc.', auditDate: '2026-03-15', status: 'Passed', findings: 'Clean record', statusColor: 'green' },
    { auditId: 'AUD-2026-002', taxpayerName: 'Global Traders', auditDate: '2026-03-20', status: 'Flagged', findings: 'Income discrepancy', statusColor: 'red' },
    { auditId: 'AUD-2026-003', taxpayerName: 'Apex Solutions', auditDate: '2026-04-05', status: 'Passed', findings: 'Verified documents', statusColor: 'green' }
  ];
}