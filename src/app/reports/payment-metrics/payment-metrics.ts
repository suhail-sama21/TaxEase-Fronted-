import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { ReportingService, PaymentMetricsResponse, PaymentResponseDto } from '../../services/reporting.service';

@Component({
  selector: 'app-payment-metrics',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './payment-metrics.html'
})
export class PaymentMetricsComponent implements OnInit {
  
  // Dynamic variables for top cards
  totalTxns: number = 0;
  successRate: string = '0%';
  failedTxns: number = 0;
  
  // Mocked because the API doesn't return average time yet
  avgTime: string = '1.2s'; 

  recentFailures: any[] = [];

  constructor(
    private reportingService: ReportingService,
    private cdr: ChangeDetectorRef // Forces UI updates
  ) {}

  ngOnInit() {
    this.loadMetrics();
    this.loadAllPayments(); // Load data for charts and tables
  }

  loadMetrics(method?: string) {
    this.reportingService.getPaymentMetrics(method).subscribe({
      next: (data: PaymentMetricsResponse) => {
        this.totalTxns = data.totalTransactions;
        this.failedTxns = data.failedTransactions;
        
        // Calculate success rate percentage dynamically
        if (data.totalTransactions > 0) {
          const rate = (data.successfulTransactions / data.totalTransactions) * 100;
          this.successRate = rate.toFixed(1) + '%';
        } else {
          this.successRate = '0%';
        }

        this.cdr.detectChanges(); // Tell Angular to update the HTML immediately
      },
      error: (err: any) => console.error('[Metrics API] Error:', err)
    });
  }

  // Triggered when dropdown changes
  onMethodChange(event: any) {
    const selectedMethod = event.target.value;
    const methodParam = selectedMethod === 'All Methods' ? undefined : selectedMethod;
    this.loadMetrics(methodParam);
  }

  loadAllPayments() {
    this.reportingService.getAllPayments().subscribe({
      next: (payments: PaymentResponseDto[]) => {
        
        // 1. Update the Failed Transactions Table
        this.recentFailures = payments
          .filter(p => p.status && (p.status.toUpperCase() === 'FAILED' || p.status.toUpperCase() === 'REJECTED'))
          .map(p => ({
            txnId: 'PAY-' + p.id,
            user: 'Taxpayer ' + p.taxpayerId,
            amount: '$' + p.amount,
            method: p.method,
            reason: 'Declined/Error'
          }));

        // 2. Update the Pie Chart Data (Volume by Method)
        const ccCount = payments.filter(p => p.method === 'CREDIT_CARD').length;
        const dcCount = payments.filter(p => p.method === 'DEBIT_CARD').length;
        const upiCount = payments.filter(p => p.method === 'UPI').length;
        const nbCount = payments.filter(p => p.method === 'NET_BANKING').length;

        this.methodChartData.datasets[0].data = [ccCount, dcCount, upiCount, nbCount];
        this.methodChartData = { ...this.methodChartData }; // Trick chart into redrawing
        
        // 3. Update the Bar Chart Data (Success vs Failed by Week)
        const successByWeek = [0, 0, 0, 0];
        const failedByWeek = [0, 0, 0, 0];

        payments.forEach(p => {
          if (p.date) {
            const date = new Date(p.date);
            const dayOfMonth = date.getDate(); // gets day from 1 to 31
            
            // Group dates into 4 weeks
            let weekIndex = 0;
            if (dayOfMonth <= 7) weekIndex = 0;
            else if (dayOfMonth <= 14) weekIndex = 1;
            else if (dayOfMonth <= 21) weekIndex = 2;
            else weekIndex = 3;

            const status = p.status ? p.status.toUpperCase() : '';
            if (status === 'COMPLETED' || status === 'SUCCESS') {
              successByWeek[weekIndex]++;
            } else if (status === 'FAILED' || status === 'REJECTED') {
              failedByWeek[weekIndex]++;
            }
          }
        });

        // Feed calculated arrays to the Bar Chart
        this.trendChartData.datasets[0].data = successByWeek;
        this.trendChartData.datasets[1].data = failedByWeek;
        this.trendChartData = { ...this.trendChartData }; // Trick chart into redrawing

        this.cdr.detectChanges(); // Update HTML for charts and table
      },
      error: (err: any) => console.error('[All Payments API] Error fetching list:', err)
    });
  }

  // --- CHART CONFIGURATIONS ---

  public methodChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['CREDIT_CARD', 'DEBIT_CARD', 'UPI', 'NET_BANKING'],
    datasets: [{
      data: [0, 0, 0, 0], // Starts at 0, updates dynamically
      backgroundColor: ['#2563eb', '#8b5cf6', '#10b981', '#f59e0b'],
      borderWidth: 0
    }]
  };

  public methodChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'right', labels: { color: '#8b949e' } } }
  };

  public trendChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      // Data starts at 0, updates dynamically based on the weeks calculation
      { data: [0, 0, 0, 0], label: 'Successful', backgroundColor: '#10b981', stack: 'a', borderRadius: 4 },
      { data: [0, 0, 0, 0], label: 'Failed', backgroundColor: '#ef4444', stack: 'a', borderRadius: 4 }
    ]
  };

  public trendChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top', labels: { color: '#8b949e' } } },
    scales: {
      x: { stacked: true, grid: { color: 'rgba(139, 148, 158, 0.2)' }, ticks: { color: '#8b949e' } },
      y: { stacked: true, grid: { color: 'rgba(139, 148, 158, 0.2)' }, ticks: { color: '#8b949e' } }
    }
  };
}