import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-filings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-filings.html'
})
export class MyFilingsComponent {
  selectedFiling: any = null;

  // Set this to 'TAXPAYER' to test the restricted view
  currentUserRole: string = 'OFFICER';

  filings = [
    { id: 101, period: 'FY2025-26', amountDeclared: 45000, submittedDate: '2026-03-01T10:00:00Z', status: 'Approved', statusColor: 'green' },
    { id: 102, period: 'FY2025-26', amountDeclared: 52000, submittedDate: '2026-03-05T14:30:00Z', status: 'Pending', statusColor: 'blue' },
    { id: 74, period: 'FY2024-25', amountDeclared: 35000, submittedDate: '2025-06-18T11:20:00Z', status: 'Rejected', statusColor: 'red' }
  ];

  constructor(private router: Router) {}

  // Role check helper
  isOfficer(): boolean {
    return this.currentUserRole === 'OFFICER' || this.currentUserRole === 'ADMIN';
  }

  // View Modal Logic
  viewDetails(filing: any) {
    console.log('Opening details for:', filing.id);
    this.selectedFiling = { ...filing }; // Use spread to avoid direct reference issues
  }

  closeDetails() {
    this.selectedFiling = null;
  }

  // Officer Status Update Logic
  updateStatus(filingId: number, newStatus: string) {
    if (!this.isOfficer()) {
      console.error("Unauthorized: You do not have permission to change status.");
      return;
    }

    const filing = this.filings.find(f => f.id === filingId);
    if (filing) {
      filing.status = newStatus;
      filing.statusColor = newStatus === 'Approved' ? 'green' : (newStatus === 'Pending' ? 'blue' : 'red');

      // Update the modal view if it's open
      if (this.selectedFiling && this.selectedFiling.id === filingId) {
        this.selectedFiling = { ...filing };
      }
      console.log(`Filing #${filingId} status updated to ${newStatus}`);
    }
  }

  // Calculation Logic
  calculateTax(amount: number): number {
    return amount * 0.10;
  }

  // Navigation Logic
  proceedToPayment(filingId: number, amount: number) {
    const taxDue = this.calculateTax(amount);
    console.log(`Initiating payment for Filing #${filingId}. Amount: ${taxDue}`);

    this.router.navigate(['/portal/payment'], {
      queryParams: {
        id: filingId,
        amount: taxDue
      }
    });
  }
}
