import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentService } from '../service/payment.service';
import { Store } from '@ngrx/store';
import { selectUser } from '../stores/authStore/auth.features';

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

  // 1. Start with empty/null data instead of hardcoded arrays
  filings: any[] = [];
  selectedFilingId: number | null = null; 
  selectedFiling: any = null;
  paymentAmount: number = 0;

  // 2. Add the userId so the fetch function works
  
  constructor(
    private router: Router, 
    private paymentService: PaymentService,
    private cdr: ChangeDetectorRef,
    private store: Store
  ) {}
  userId: number  =0; // Replace later with your actual logged-in user ID


  ngOnInit(): void {
    this.store.select(selectUser).subscribe(user => {
          if (user) {
            this.userId = user.id
            console.log('User Data from Store:', this.userId);
          }
        });
    // 3. Trigger the fetch from the backend when the page loads!
    this.fetchPendingFilings(); 
  }

  fetchPendingFilings() {
    // Call the service method to get ALL history
    this.paymentService.getAllFilings(this.userId).subscribe({
      next: (backendData: any[]) => {
        
        // FILTER: Keep only the items where status is 'Pending'
        const pendingData = backendData.filter(filing => 
         
          filing.status && filing.status.toLowerCase() === 'pending'
        );
        console.log('Pending filings:', pendingData); // Debug log
        // MAP: Transform the filtered data to fit your dropdown UI
        this.filings = pendingData.map(filing => ({
          id: filing.id, 
          displayId: 'FIL-' + filing.id,
          period: filing.period || 'Current Period', 
          amount: filing.amountDeclared || filing.amount // Adjust based on your backend keys
        }));

        // SELECT: Automatically select the first filing if the list isn't empty
        if (this.filings.length > 0) {
          this.selectedFilingId = this.filings[0].id;
          this.onFilingChange(); // Sync the UI amounts
        } else {
           this.selectedFilingId = null;
           this.paymentAmount = 0;
        }
        
        // Tell Angular to update the screen
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load filings history', err);
        alert('Could not load your tax filings.');
      }
    });
  }

  // UPDATES THE UI WHEN SELECTION CHANGES
  onFilingChange() {
    // Use == instead of === just in case the HTML select turns the ID into a string
    this.selectedFiling = this.filings.find(f => f.id == this.selectedFilingId);
    if (this.selectedFiling) {
      this.paymentAmount = this.selectedFiling.amount;
    }
  }

  selectMethod(method: string) {
    this.selectedMethod = method;
  }

  processPayment() {
    if (!this.selectedFilingId) {
      alert('Please select a valid filing to pay for.');
      return;
    }

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