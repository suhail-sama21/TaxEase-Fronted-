import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-payment-metrics',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './payment-metrics.html'
})
export class PaymentMetricsComponent {
  
  totalTxns: number = 5635;
  successRate: string = '97.8%';
  avgTime: string = '1.2s';
  failedTxns: number = 124;

  public methodChartData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Credit Card', 'UPI / Wallet', 'Net Banking', 'Wire'],
    datasets: [{
      data: [1245, 3420, 850, 120],
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
      { data: [1200, 1400, 1350, 1561], label: 'Successful', backgroundColor: '#10b981', stack: 'a', borderRadius: 4 },
      { data: [20, 45, 12, 47], label: 'Failed', backgroundColor: '#ef4444', stack: 'a', borderRadius: 4 }
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

  recentFailures = [
    { txnId: 'TXN-9980', user: 'Acme Corp', amount: '$5,000', method: 'Net Banking', reason: 'Timeout' },
    { txnId: 'TXN-9981', user: 'John Doe', amount: '$450', method: 'Credit Card', reason: 'Insufficient Funds' },
    { txnId: 'TXN-9982', user: 'Zenith Ltd', amount: '$1,200', method: 'UPI', reason: 'Network Error' }
  ];
}