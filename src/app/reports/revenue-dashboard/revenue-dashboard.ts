import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { ReportingService, RevenueDashboardResponse, AuditDashboardResponse, PaymentResponseDto } from '../../core/services/reporting.service';

@Component({
  selector: 'app-revenue-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './revenue-dashboard.html'
})
export class RevenueDashboardComponent implements OnInit {
  
  // API variables mapped from backend
  totalRevenue: number = 0;
  outstandingPayments: number = 0;
  settlementRate: string = '0%';
  activeAudits: number = 0;

  constructor(
    private reportingService: ReportingService,
    private cdr: ChangeDetectorRef // Forces UI updates immediately
  ) {}

  ngOnInit() {
    this.loadTopCards();
    this.loadChartData();
  }

  loadTopCards() {
    // 1. Fetch Revenue metrics
    this.reportingService.getRevenueDashboard().subscribe({
      next: (data: RevenueDashboardResponse) => {
        this.totalRevenue = data.revenueCollected || 0;
        this.outstandingPayments = data.outstandingPayments || 0;
        
        // Calculate Settlement Rate dynamically
        const total = this.totalRevenue + this.outstandingPayments;
        if (total > 0) {
          this.settlementRate = ((this.totalRevenue / total) * 100).toFixed(1) + '%';
        }
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Error fetching revenue metrics', err)
    });

    // 2. Fetch Active Audits
    this.reportingService.getAuditDashboard().subscribe({
      next: (data: AuditDashboardResponse) => {
        this.activeAudits = data.openAudits || 0;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Error fetching audit metrics', err)
    });
  }

  loadChartData() {
    // 3. Fetch All Payments to populate the Bar Chart dynamically
    this.reportingService.getAllPayments().subscribe({
      next: (payments: PaymentResponseDto[]) => {
        
        // Group collections by Quarter (Q1, Q2, Q3, Q4)
        const collectedByQ = [0, 0, 0, 0];
        
        payments.forEach(p => {
           if (p.status.toUpperCase() === 'COMPLETED' && p.date) {
               const month = new Date(p.date).getMonth(); // 0 = Jan, 11 = Dec
               if (month < 3) collectedByQ[0] += p.amount;
               else if (month < 6) collectedByQ[1] += p.amount;
               else if (month < 9) collectedByQ[2] += p.amount;
               else collectedByQ[3] += p.amount;
           }
        });
        
        // Feed real DB data into the Bar Chart
        this.barChartData.datasets[0].data = collectedByQ;
        this.barChartData = { ...this.barChartData }; // Trigger redraw
        
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Error fetching payments for chart', err)
    });
  }

  // --- CHART CONFIGURATIONS ---

  // CHART 1: Collection vs Target
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      { 
        data: [0, 0, 0, 0], // Starts at 0, dynamically updated from DB
        label: 'Collected ($)', 
        backgroundColor: '#2563eb', 
        borderRadius: 6
      },
      { 
        data: [40000, 40000, 40000, 40000], // Mocked Target amounts
        label: 'Target ($)', 
        backgroundColor: '#94a3b8', 
        borderRadius: 6
      }
    ]
  };

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#8b949e' } } 
    },
    scales: {
      x: { grid: { color: 'rgba(139, 148, 158, 0.2)' }, ticks: { color: '#8b949e' } },
      y: { grid: { color: 'rgba(139, 148, 158, 0.2)' }, ticks: { color: '#8b949e' } }
    }
  };

  // CHART 2: Revenue by Program (Mocked as we don't store exact programs yet)
  public doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Corporate Tax', 'Income Tax', 'GST / VAT'],
    datasets: [
      {
        data: [8.5, 4.2, 1.5],
        backgroundColor: ['#2563eb', '#38bdf8', '#fbbf24'],
        borderWidth: 0 
      }
    ]
  };

  public doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#8b949e', padding: 20 } }
    },
    cutout: '75%' 
  };
}