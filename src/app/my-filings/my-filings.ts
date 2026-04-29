import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-filings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-filings.html'
})
export class MyFilingsComponent {
  // Updated mock data to match TaxFiling entity and ResponseDTO
  filings = [
    { id: 101, period: 'FY2025-26', amountDeclared: 45000, submittedDate: '2026-03-01T10:00:00Z', status: 'Approved', statusColor: 'green' },
    { id: 102, period: 'FY2025-26', amountDeclared: 52000, submittedDate: '2026-03-05T14:30:00Z', status: 'Pending', statusColor: 'blue' },
    { id: 85, period: 'FY2024-25', amountDeclared: 38000, submittedDate: '2025-12-15T09:00:00Z', status: 'Approved', statusColor: 'green' },
    { id: 74, period: 'FY2024-25', amountDeclared: 35000, submittedDate: '2025-06-18T11:20:00Z', status: 'Rejected', statusColor: 'red' }
  ];

  // Helper to calculate tax due (consistent with 10% frontend logic)
  calculateTax(amount: number): number {
    return amount * 0.10;
  }
}
