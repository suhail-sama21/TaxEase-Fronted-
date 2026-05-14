import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PaymentService } from '../service/payment.service';
import { Store } from '@ngrx/store';
import { selectUser } from '../stores/authStore/auth.features';

@Component({
  selector: 'app-payment-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-history.html'
})
export class PaymentHistoryComponent implements OnInit {

  store = inject(Store)

  allTransactions: any[] = []; 
  transactions: any[] = [];    
  userId: number = 0


  totalPaid: number = 0;
  totalTransactions: number = 0;
  failedTransactions: number = 0;

  constructor(
    private router: Router,
    private paymentService: PaymentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.store.select(selectUser).subscribe(user => {
      if (user) {
        this.userId = user.id;
        console.log('User Data from Store:', this.userId);
      } else {
        console.log("No user data found in store")
      }
    });
    this.loadHistory();
  }

  loadHistory() {
    this.paymentService.getPaymentHistory(this.userId).subscribe({
      next: (backendData: any[]) => {
        this.allTransactions = backendData.map(payment => ({
          id: 'PAY-' + payment.id,
          rawId: payment.id, // Store raw ID for routing
          date: payment.date ? payment.date.split('T')[0] : 'N/A',
          amount: '$' + parseFloat(payment.amount).toLocaleString('en-US', {minimumFractionDigits: 2}),
          method: this.formatMethod(payment.method),
          rawMethod: payment.method,
          filing: payment.filingId ? 'FIL-' + payment.filingId : 'N/A',
          status: payment.status,
          statusColor: payment.status === 'Completed' || payment.status === 'Success' ? 'green' : 'red',
          rawFilingId: payment.filingId,
          rawAmount: payment.amount
        }));

        this.transactions = [...this.allTransactions];
        this.calculateMetrics(backendData);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching payment history', error);
        alert('Failed to load history. Check the console.');
      }
    });
  }

  filterByMethod(event: any) {
    const selectedMethod = event.target.value;
    if (selectedMethod === 'ALL') {
      this.transactions = [...this.allTransactions];
    } else {
      this.transactions = this.allTransactions.filter(t => t.rawMethod === selectedMethod);
    }
    this.cdr.detectChanges();
  }

  formatMethod(method: string): string {
    if (!method) return 'N/A';
    if (method === 'UPI') return 'UPI';
    return method.replace('_', ' ').replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())));
  }

  calculateMetrics(data: any[]) {
    this.totalTransactions = data.length;
    this.failedTransactions = data.filter(p => p.status === 'Failed').length;
    this.totalPaid = data
      .filter(p => p.status === 'Completed' || p.status === 'Success')
      .reduce((sum, p) => sum + parseFloat(p.amount), 0);
  }

  downloadReceipt(rawId: string) {
    this.router.navigate(['/portal/receipt', rawId]);
  }

  retryPayment(transaction: any) {
    this.router.navigate(['/portal/payment'], {
      queryParams: {
        filingId: transaction.rawFilingId,
        amount: transaction.rawAmount
      }
    });
  }
}