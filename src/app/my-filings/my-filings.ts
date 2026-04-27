import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-filings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-filings.html'
})
export class MyFilingsComponent {
  // Mock data to match your UI design until backend integration
  filings = [
    { id: 'FIL-2026-001', period: 'Q1 2026', declared: '$45,000', tax: '$4,500', submitted: '2026-03-01', status: 'Approved', statusColor: 'green' },
    { id: 'FIL-2026-002', period: 'Q2 2026', declared: '$52,000', tax: '$5,200', submitted: '2026-03-05', status: 'Submitted', statusColor: 'blue' },
    { id: 'FIL-2025-012', period: 'Q4 2025', declared: '$38,000', tax: '$3,800', submitted: '2025-12-15', status: 'Approved', statusColor: 'green' },
    { id: 'FIL-2025-011', period: 'Q3 2025', declared: '$41,000', tax: '$4,100', submitted: '2025-09-20', status: 'Approved', statusColor: 'green' },
    { id: 'FIL-2025-010', period: 'Q2 2025', declared: '$35,000', tax: '$3,500', submitted: '2025-06-18', status: 'Rejected', statusColor: 'red' },
    { id: 'FIL-2025-009', period: 'Q1 2025', declared: '$39,000', tax: '$3,900', submitted: '2025-03-10', status: 'Approved', statusColor: 'green' }
  ];
}