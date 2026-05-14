import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router'; 
import { Store } from '@ngrx/store';
import { selectUser } from '../stores/authStore/auth.features';

import { PaymentService } from '../service/payment.service';
import { TaxFilingService } from '../service/tax-filing.service'; 

@Component({
  selector: 'app-make-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './make-payment.html'
})
export class MakePaymentComponent implements OnInit {
  selectedMethod: string = ''; 
  isProcessing = false;
  paymentSuccess = false;
  generatedPaymentId: string = '';
  
  errorMessage: string = ''; 

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
        this.errorMessage = 'Could not load your tax filings.'; 
      }
    });
  }

  onFilingChange() {
    this.errorMessage = '';
    this.selectedFiling = this.filings.find(f => f.id == this.selectedFilingId);
    if (this.selectedFiling) {
      this.paymentAmount = this.selectedFiling.amount;
    }
  }

  selectMethod(method: string) {
    this.errorMessage = '';
    
    if (this.selectedMethod === method) {
      this.selectedMethod = ''; 
    } else {
      this.selectedMethod = method; 
    }
  }

  processPayment() {
    this.errorMessage = '';

    if (!this.selectedFilingId) {
      this.errorMessage = 'Please select a valid filing to pay for.';
      return;
    }

    if (!this.selectedMethod) {
      this.errorMessage = 'Please select a payment method.';
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
        this.taxFilingService.updateStatus(this.selectedFilingId!, 'Completed').subscribe({
          next: (statusUpdateResponse) => {
            this.isProcessing = false;
            this.paymentSuccess = true;
            this.generatedPaymentId = 'PAY-' + response.id;

            this.filings = this.filings.filter(f => f.id != this.selectedFilingId);

            if (this.filings.length > 0) {
              this.selectedFilingId = this.filings[0].id;
              this.onFilingChange();
            } else {
              this.selectedFilingId = null;
              this.selectedFiling = null;
              this.paymentAmount = 0;
            }
            this.selectedMethod = ''; 
            
            this.cdr.detectChanges();
          },
          error: (statusErr) => {
            this.isProcessing = false;
            this.errorMessage = 'Payment was successful, but we could not update the filing status. Please contact support.';
          }
        });
      },
      error: (err) => {
        this.isProcessing = false;
        this.errorMessage = 'Payment failed. Check your data.';
      }
    });
  }
  goToReceipt() {
    const cleanId = this.generatedPaymentId.replace('PAY-', '');
    this.router.navigate(['/portal/receipt', cleanId]);
  }

  goToFilings() { this.router.navigate(['/portal/filings']); }
}