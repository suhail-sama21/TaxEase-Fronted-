import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetricCardComponent } from '../components/metric-card/metric-card';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MetricCardComponent],
  templateUrl: './dashboard.html'
})
export class DashboardComponent {
  // We will eventually load this array from your backend API
  recentFilings = [
    { id: 'FIL-2026-001', period: 'Q1 2026', amount: '$45,000', date: '2026-03-01', status: 'Approved', statusColor: 'green' },
    { id: 'FIL-2026-002', period: 'Q2 2026', amount: '$52,000', date: '2026-03-05', status: 'Submitted', statusColor: 'blue' },
    { id: 'FIL-2025-012', period: 'Q4 2025', amount: '$38,000', date: '2025-12-15', status: 'Approved', statusColor: 'green' },
    { id: 'FIL-2025-010', period: 'Q2 2025', amount: '$35,000', date: '2025-06-18', status: 'Rejected', statusColor: 'red' }
  ];
}