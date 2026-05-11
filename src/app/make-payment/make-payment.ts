import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'; 
import { Store } from '@ngrx/store';
import { selectUser } from '../stores/authStore/auth.features';

// Import BOTH services
import { PaymentService } from '../service/payment.service';
import { TaxFilingService } from '../service/tax-filing.service'; 

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

  filings: any[] = [];
  selectedFilingId: number | null = null; 
  selectedFiling: any = null;
  paymentAmount: number = 0;
  userId: number = 0;

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private taxFilingService: TaxFilingService, 
    private cdr: ChangeDetectorRef,
    private store: Store
  ) {}

  ngOnInit(): void {
    // Catch the Retry parameters from the Payment History page
    this.route.queryParams.subscribe(params => {
      if (params['filingId']) {
        this.selectedFilingId = Number(params['filingId']);
      }
      if (params['amount']) {
        this.paymentAmount = Number(params['amount']);
      }
    });

    this.store.select(selectUser).subscribe(user => {
      if (user) {
        this.userId = user.id;
        console.log('User Data from Store:', this.userId);
        this.fetchPendingFilings(); 
      }
    });
  }

  fetchPendingFilings() {
    this.paymentService.getAllFilings(this.userId).subscribe({
      next: (backendData: any[]) => {
        const pendingData = backendData.filter(filing => 
          filing.status && filing.status.toLowerCase() === 'pending'
        );
        
        this.filings = pendingData.map(filing => ({
          id: filing.id, 
          displayId: 'FIL-' + filing.id,
          period: filing.period || 'Current Period', 
          amount: filing.amountDeclared || filing.amount 
        }));

        if (this.filings.length > 0) {
          // If we DIDN'T come from the Retry button, select the first one by default
          if (!this.selectedFilingId) {
            this.selectedFilingId = this.filings[0].id;
          }
          this.onFilingChange(); 
        } else {
           this.selectedFilingId = null;
           this.paymentAmount = 0;
        }
        
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load filings history', err);
        alert('Could not load your tax filings.');
      }
    });
  }

  onFilingChange() {
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
    
    // 1. Process the payment first
    this.paymentService.makePayment(payload).subscribe({
      next: (response: any) => {
        
        // 2. If payment is successful, update the tax filing status to 'Completed'
        this.taxFilingService.updateStatus(this.selectedFilingId!, 'Completed').subscribe({
          next: (statusUpdateResponse) => {
            // Both payment AND status update succeeded!
            this.isProcessing = false;
            this.paymentSuccess = true;
            this.generatedPaymentId = 'PAY-' + response.id;

            // Dynamically remove the paid file from the UI
            this.filings = this.filings.filter(f => f.id != this.selectedFilingId);

            if (this.filings.length > 0) {
              this.selectedFilingId = this.filings[0].id;
              this.onFilingChange();
            } else {
              this.selectedFilingId = null;
              this.selectedFiling = null;
              this.paymentAmount = 0;
            }
            
            this.cdr.detectChanges();
          },
          error: (statusErr) => {
            this.isProcessing = false;
            console.error('Payment succeeded but filing status update failed:', statusErr);
            alert('Payment was successful, but we could not update the filing status. Please contact support.');
          }
        });

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