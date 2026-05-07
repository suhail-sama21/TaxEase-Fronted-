import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PaymentService } from '../service/payment.service';
//
import {ActivatedRoute } from '@angular/router';

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
  userId: number = 1; // Replace later with your actual logged-in user ID

  constructor(
    private router: Router,
    private paymentService: PaymentService,
    private cdr: ChangeDetectorRef,
    //
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // 3. Trigger the fetch from the backend when the page loads!
    this.fetchPendingFilings();
  }

  fetchPendingFilings() {
    // Call the service method to get ALL history
    this.paymentService.getAllFilings(this.userId).subscribe({
          next: (backendData: any[]) => {
            // Change filter to 'approved' if that's when they should pay
            const pendingData = backendData.filter(filing =>
              filing.status && filing.status.toLowerCase() === 'approved'
            );

            this.filings = pendingData.map(filing => ({
              id: filing.id,
              displayId: 'FIL-' + filing.id,
              period: filing.period,
              amount: filing.amountDeclared * 0.10 // Assuming 10% tax
            }));

            // CHECK FOR QUERY PARAMS (Autofill Logic)
            this.route.queryParams.subscribe(params => {
              if (params['id']) {
                this.selectedFilingId = Number(params['id']);
                this.paymentAmount = Number(params['amount']);

                // Ensure the selected filing exists in our list for the dropdown
                this.selectedFiling = this.filings.find(f => f.id == this.selectedFilingId);
              } else if (this.filings.length > 0) {
                // Default to first if no params
                this.selectedFilingId = this.filings[0].id;
                this.onFilingChange();
              }
            });

            this.cdr.detectChanges();
          },
          error: (err) => console.error(err)
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
