import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TaxFilingService } from '../service/tax-filing.service';

@Component({
  selector: 'app-my-filings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './my-filings.html'
})
export class MyFilingsComponent implements OnInit {
  filings: any[] = [];
  selectedFiling: any = null;
  currentUserRole: string = 'TAXPAYER'; // Or 'TAXPAYER'

  constructor(
    private taxFilingService: TaxFilingService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadFilings();
  }

  loadFilings() {
    // For demo, using a fixed taxpayerId or fetching all if officer
    const taxpayerId = 10;
    this.taxFilingService.getHistory(taxpayerId).subscribe({
      next: (data) => this.filings = data,
      error: (err) => console.error('Load failed', err)
    });
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
    const officerId = 1; // Mock officer ID from session
    this.taxFilingService.updateStatus(filingId, newStatus, officerId).subscribe({
      next: (updated) => {
        this.loadFilings(); // Refresh table
        this.selectedFiling = updated; // Update modal
        console.log('Status updated successfully');
      },
      error: (err) => alert('Update failed: ' + err.message)
    });
  }

  calculateTax(amount: number): number {
    return amount * 0.10;
  }
 proceedToPayment(filingId: number, amountDeclared: number) {
   // Calculate the 10% tax here so the payment page doesn't have to guess the logic
   const taxDue = amountDeclared * 0.10;

   this.router.navigate(['/portal/payment'], {
     queryParams: {
       id: filingId,
       amount: taxDue.toFixed(2), // Send the actual tax amount, not the total declared
       type: 'TAX_PAYMENT'
     }
   });
 }
  //proceedToPayment(filingId: number, amount: number) {
    //this.router.navigate(['/portal/payment'], {
      //queryParams: { id: filingId, amount: this.calculateTax(amount) }
    //});
  //}
//}
