import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-make-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './make-payment.html'
})
export class MakePaymentComponent {
  selectedMethod: 'bank' | 'wallet' | 'card' = 'bank';
  isProcessing = false;
  paymentSuccess = false;
  
  paymentAmount = 4100.00; // Mock amount

  constructor(private router: Router) {}

  selectMethod(method: 'bank' | 'wallet' | 'card') {
    this.selectedMethod = method;
  }

  processPayment() {
    this.isProcessing = true;
    
    // Simulate API call to process payment
    setTimeout(() => {
      this.isProcessing = false;
      this.paymentSuccess = true;
    }, 1500);
  }

  goToHistory() {
    // We will build this next!
    this.router.navigate(['/history']);
  }

  goToFilings() {
    this.router.navigate(['/filings']);
  }
}