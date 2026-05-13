import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { TaxpayerService } from '../service/taxpayer-service';
import { PendingTaxpayerSummary } from '../dto/taxpayer-profile';

@Component({
  selector: 'app-documents-verification',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './documents-verification.html'
})
export class DocumentsVerificationComponent implements OnInit {
  pendingTaxpayers$: Observable<PendingTaxpayerSummary[]> = of([]);
  loading = true;
  errorMessage = '';

  constructor(private service: TaxpayerService, private router: Router) {}

  ngOnInit(): void {
    this.loadPendingTaxpayers();
  }

  loadPendingTaxpayers(): void {
    this.loading = true;
    this.errorMessage = '';
    this.pendingTaxpayers$ = this.service.getPendingTaxpayerDocuments().pipe(
      tap(() => this.loading = false),
      catchError(error => {
        console.error('Failed to load pending taxpayer verification list', error);
        this.errorMessage = 'Unable to fetch verification data at the moment.';
        this.loading = false;
        return of([]);
      })
    );
  }

  reviewTaxpayer(taxpayer: PendingTaxpayerSummary): void {
    this.router.navigate(['/portal/status', taxpayer.userId]);
  }
}
