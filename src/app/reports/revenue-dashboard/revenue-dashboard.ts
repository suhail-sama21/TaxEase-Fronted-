import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-revenue-dashboard',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './revenue-dashboard.html'
})
export class RevenueDashboardComponent {
  
  // API variables mapped from backend
  totalRevenue: number = 4200000;
  outstandingPayments: number = 850000;
  settlementRate: string = '92.5%';
  activeAudits: number = 142;

  // CHART 1: Collection vs Target
  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      { 
        data: [3.2, 3.8, 4.1, 3.1], 
        label: 'Collected ($M)', 
        backgroundColor: '#2563eb', // Modern Blue
        borderRadius: 6
      },
      { 
        data: [3.5, 3.5, 4.0, 4.0], 
        label: 'Target ($M)', 
        backgroundColor: '#cbd5e1', // Light Slate
        borderRadius: 6
      }
    ]
  };

  public barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: '#475569' } } // Slate-600 text
    },
    scales: {
      x: { grid: { color: '#f1f5f9' }, ticks: { color: '#64748b' } },
      y: { grid: { color: '#f1f5f9' }, ticks: { color: '#64748b' } }
    }
  };

  // CHART 2: Revenue by Program
  public doughnutChartData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Corporate Tax', 'Income Tax', 'GST / VAT'],
    datasets: [
      {
        data: [8.5, 4.2, 1.5],
        backgroundColor: ['#2563eb', '#38bdf8', '#fbbf24'], // Blue, Light Blue, Amber
        borderColor: '#ffffff', // White border for clean cut
        borderWidth: 3
      }
    ]
  };

  public doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { color: '#475569', padding: 20 } }
    },
    cutout: '75%' 
  };
}