import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentService } from '../service/payment.service';

@Component({
  selector: 'app-make-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './make-payment.html'
})
export class MakePaymentComponent implements OnInit {
  selectedMethod: string = 'CREDIT_CARD';
  isProcessing = false;
  paymentSuccess = false;
  generatedPaymentId: string = '';

  // DYNAMIC DATA STORAGE
  filings: any[] = [
    { id: 1, displayId: 'FIL-2025-011', period: 'Q3 2025', amount: 42340.00 },
    { id: 2, displayId: 'FIL-2026-001', period: 'Q1 2026', amount: 4500.00 },
    { id: 3, displayId: 'FIL-2025-012', period: 'Q4 2025', amount: 3800.00 }
  ];
  
  selectedFilingId: number = 1; 
  selectedFiling: any = this.filings[0];
  paymentAmount: number = this.filings[0].amount;

  constructor(
    private router: Router, 
    private paymentService: PaymentService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.onFilingChange(); // Sync initial data
  }

  // UPDATES THE UI WHEN SELECTION CHANGES
  onFilingChange() {
    this.selectedFiling = this.filings.find(f => f.id === this.selectedFilingId);
    if (this.selectedFiling) {
      this.paymentAmount = this.selectedFiling.amount;
    }
  }

  selectMethod(method: string) {
    this.selectedMethod = method;
  }

  processPayment() {
    this.isProcessing = true;
    const payload = {
      filingId: this.selectedFilingId,
      amount: this.paymentAmount,
      method: this.selectedMethod,
      status: 'Completed'
    };

    this.paymentService.makePayment(payload).subscribe({
      next: (response: any) => {
        this.isProcessing = false;
        this.paymentSuccess = true;
        this.generatedPaymentId = 'PAY-' + response.id;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isProcessing = false;
        alert('Payment failed. Check your data.');
      }
    });
  }

  goToHistory() { this.router.navigate(['/portal/history']); }
  goToFilings() { this.router.navigate(['/portal/filings']); }
}