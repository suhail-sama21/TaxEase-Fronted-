import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-history.html'
})
export class PaymentHistoryComponent {
  transactions = [
    { id: 'PAY-88291', date: '2026-02-15', amount: '$1,250.00', method: 'Bank Transfer', filing: 'FIL-2026-001', status: 'Completed', statusColor: 'green' },
    { id: 'PAY-88290', date: '2025-11-10', amount: '$450.00', method: 'Digital Wallet', filing: 'FIL-2025-012', status: 'Completed', statusColor: 'green' },
    { id: 'PAY-88289', date: '2025-08-05', amount: '$2,100.00', method: 'Bank Transfer', filing: 'FIL-2025-011', status: 'Completed', statusColor: 'green' },
    { id: 'PAY-88288', date: '2025-05-12', amount: '$150.00', method: 'Digital Wallet', filing: 'FIL-2025-010', status: 'Failed', statusColor: 'red' }
  ];

  constructor(private router: Router) {}

  downloadReceipt(paymentId: string) {
    alert(`Downloading receipt for ${paymentId}...`);
    // Logic to call API and trigger PDF download will go here
  }

  retryPayment() {
    this.router.navigate(['/payment']);
  }
}