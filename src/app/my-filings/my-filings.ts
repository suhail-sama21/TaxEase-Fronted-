import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaxFilingService } from '../core/services/tax-filing.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { selectUser } from '../stores/authStore/auth.features';

@Component({
  selector: 'app-my-filings',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './my-filings.html'
})
export class MyFilingsComponent implements OnInit {

  taxpayerId: number = 0;
  filings: any[] = [];
  allFilings: any[] = [];
  selectedFiling: any = null;
  currentUserRole: string = 'TAXPAYER';

  selectedPeriod: string = 'All Periods';
  selectedStatus: string = 'All Statuses';

  isLoading = false;
  isUpdating = false;
  errorMessage = '';
  userRole = 'USER';

  constructor(
    private taxFilingService: TaxFilingService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private store: Store
  ){
    //let id:number;
    this.store.select(selectUser).subscribe(user => {
      if(user){
        //assigning taxpayer id
         this.taxpayerId = user.id;
         this.userRole= user.role;
      }
    })
  }

  ngOnInit() {
    this.loadFilings();
  }

  loadFilings() {
    const taxpayerId = this.taxpayerId;
    this.isLoading = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.taxFilingService.getHistory(taxpayerId).subscribe({
      next: (data) => {
        this.isLoading = false;
        this.allFilings = data || [];
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isLoading = false;

        if (err.status === 404) {
          this.errorMessage = 'No filings found for this taxpayer.';
        } else if (err.status === 0) {
          this.errorMessage = 'Network error. Please check your connection and refresh the page.';
        } else if (err.status === 500) {
          this.errorMessage = 'Server error. Please try again later.';
        } else {
          this.errorMessage = 'Failed to load filings. Please try again.';
        }

        this.allFilings = [];
        this.filings = [];
        this.cdr.detectChanges();
      }
    });
  }

  applyFilters() {
    this.filings = this.allFilings.filter(f => {
      const matchesPeriod = this.selectedPeriod === 'All Periods' || f.period === this.selectedPeriod;
      const matchesStatus = this.selectedStatus === 'All Statuses' || f.status === this.selectedStatus;
      return matchesPeriod && matchesStatus;
    });
    this.cdr.detectChanges();
  }

  isOfficer(): boolean {
    return this.currentUserRole === 'OFFICER' || this.currentUserRole === 'ADMIN';
  }

  viewDetails(filing: any) {
    if (!filing || !filing.id) {
      this.errorMessage = 'Error: Invalid filing data.';
      this.cdr.detectChanges();
      return;
    }
    this.selectedFiling = { ...filing };
    this.cdr.detectChanges();
  }

  closeDetails() {
    this.selectedFiling = null;
    this.cdr.detectChanges();
  }

  updateStatus(filingId: number, newStatus: string) {
    if (!filingId) {
      this.errorMessage = 'Error: Invalid filing ID.';
      this.cdr.detectChanges();
      return;
    }

    const officerId = 1;
    this.isUpdating = true;
    this.errorMessage = '';
    this.cdr.detectChanges();

    this.taxFilingService.updateStatus(filingId, newStatus, officerId).subscribe({
      next: (updatedFiling) => {
        const index = this.allFilings.findIndex(f => f.id === filingId);
        if (index !== -1) {
          this.allFilings[index].status = newStatus;
          this.allFilings[index].statusColor =
            newStatus === 'Approved' || newStatus === 'Paid' ? 'green' :
            newStatus === 'Pending' ? 'blue' : 'red';
        }
        this.isUpdating = false;
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isUpdating = false;

        if (err.status === 400) {
          this.errorMessage = 'Error: Invalid status update. Please try again.';
        } else if (err.status === 404) {
          this.errorMessage = 'Error: Filing not found. It may have been deleted.';
        } else if (err.status === 409) {
          this.errorMessage = 'Error: Cannot update this filing at the moment. Please try again later.';
        } else if (err.status === 0) {
          this.errorMessage = 'Error: Network error. Please check your connection.';
        } else {
          this.errorMessage = 'Error: Failed to update status. Please try again.';
        }

        this.cdr.detectChanges();
      }
    });
  }

  calculateTax(amount: number): number {
    return amount * 0.10;
  }

  proceedToPayment(filingId: number, amountDeclared: number) {
    if (!filingId || !amountDeclared) {
      this.errorMessage = 'Error: Invalid filing data. Please try again.';
      this.cdr.detectChanges();
      return;
    }

    const taxDue = amountDeclared * 0.10;
    this.router.navigate(['/portal/payment'], {
      queryParams: {
        id: filingId,
        amount: taxDue.toFixed(2),
        type: 'TAX_PAYMENT'
      }
    }).catch(err => {
      this.errorMessage = 'Error: Could not navigate to payment. Please try again.';
      this.cdr.detectChanges();
    });
  }

  clearError() {
    this.errorMessage = '';
    this.cdr.detectChanges();
  }
}
