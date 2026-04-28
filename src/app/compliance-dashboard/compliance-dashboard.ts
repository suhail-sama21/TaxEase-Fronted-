import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- This fixes ngClass, ngFor, and the number pipe

@Component({
  selector: 'app-compliance-dashboard',
  standalone: true,
  imports: [CommonModule], // <-- Must be included here
  templateUrl: './compliance-dashboard.html'
})
export class  ComplianceDashboard  { // Ensure the class is exported

  // This fixes the "Property 'metrics' does not exist" error
  metrics = {
    totalChecks: 12450,
    pendingReviews: 342,
    nonCompliant: 89
  };

  recentChecks = [
    { id: 'CMP-1042', taxpayer: 'Acme Corp', taxpayerId: 'TXP-8821', type: 'Filing Deadline', date: '2026-03-01', status: 'Compliant', statusColor: 'green' },
    { id: 'CMP-1043', taxpayer: 'John Doe', taxpayerId: 'TXP-1002', type: 'Payment Match', date: '2026-03-02', status: 'Non-Compliant', statusColor: 'red' },
    { id: 'CMP-1044', taxpayer: 'TechFlow LLC', taxpayerId: 'TXP-9932', type: 'Audit Follow-up', date: '2026-03-03', status: 'Pending Review', statusColor: 'amber' },
    { id: 'CMP-1045', taxpayer: 'Jane Smith', taxpayerId: 'TXP-1005', type: 'Filing Deadline', date: '2026-03-04', status: 'Compliant', statusColor: 'green' }
  ];

  // This fixes the "Property 'runNewCheck' does not exist" error
  runNewCheck() {
    alert('Initiating new compliance check...');
  }
}
