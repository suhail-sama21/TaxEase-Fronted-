import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TaxFilingService } from '../service/tax-filing.service';

@Component({
  selector: 'app-my-filings',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './my-filings.html'
})
export class MyFilingsComponent implements OnInit {
  filings: any[] = [];
  allFilings: any[] = [];
  selectedFiling: any = null;
  currentUserRole: string = 'TAXPAYER';

  selectedPeriod: string = 'All Periods';
  selectedStatus: string = 'All Statuses';

  constructor(
    private taxFilingService: TaxFilingService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadFilings();
  }

  loadFilings() {
    const taxpayerId = 10;
    this.taxFilingService.getHistory(taxpayerId).subscribe({
      next: (data) => {
        this.allFilings = data;
        this.applyFilters();
      },
      error: (err) => console.error('Load failed', err)
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
    this.selectedFiling = { ...filing };
  }

  closeDetails() {
    this.selectedFiling = null;
  }

  updateStatus(filingId: number, newStatus: string) {
    const officerId = 1;

    this.taxFilingService.updateStatus(filingId, newStatus, officerId).subscribe({
      next: (updatedFiling) => {
        console.log('Status updated to:', newStatus);

        const index = this.allFilings.findIndex(f => f.id === filingId);
        if (index !== -1) {
          this.allFilings[index].status = newStatus;
          // Logic to handle 'Paid' color mapping
          this.allFilings[index].statusColor =
            newStatus === 'Approved' || newStatus === 'Paid' ? 'green' :
            newStatus === 'Pending' ? 'blue' : 'red';
        }

        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to update status', err);
        alert('Error: Could not update status.');
      }
    });
  }

  calculateTax(amount: number): number {
    return amount * 0.10;
  }

  proceedToPayment(filingId: number, amount: number) {
    const taxAmount = this.calculateTax(amount);
    this.router.navigate(['/portal/payment'], {
      queryParams: {
        id: filingId,
        amount: taxAmount.toFixed(2)
      }
    });
  }
}
