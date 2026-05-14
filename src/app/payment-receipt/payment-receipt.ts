import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUser } from '../stores/authStore/auth.features'; 
import { PaymentService } from '../service/payment.service';

@Component({
  selector: 'app-payment-receipt',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment-receipt.html'
})
export class PaymentReceiptComponent implements OnInit {
  paymentId: string | null = null;
  receiptData: any = null;
  isLoading: boolean = true; 
  taxpayerName: string = '';

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private router: Router,
    private store: Store,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.store.select(selectUser).subscribe((user: any) => { 
      if (user) {
        this.taxpayerName = user.name || user.username || user.fullName || 'Taxpayer'; 
      }
    });

    this.paymentId = this.route.snapshot.paramMap.get('id');
    
    if (this.paymentId) {
      this.fetchReceiptDetails(this.paymentId);
    } else {
      this.isLoading = false;
    }
  }

  fetchReceiptDetails(id: string) {
    this.isLoading = true;

    this.paymentService.getPaymentById(id).subscribe({
      next: (backendData: any) => {
        this.receiptData = {
          id: backendData.id,
          date: backendData.date,
          amount: backendData.amount,
          method: backendData.method,
          status: backendData.status,
          filingId: backendData.filingId, 
          taxpayerName: this.taxpayerName 
        };
        
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to fetch receipt', err);
        alert('Could not load receipt details. Please try again later.');
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  printReceipt() {
    window.print();
  }

  goBack() {
    this.router.navigate(['/portal/history']);
  }
}