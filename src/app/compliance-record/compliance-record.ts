import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComplianceService } from '../services/compliance.service';
import { ComplianceResponse, UpdateComplianceRequest } from '../models/compliance.model';

@Component({
  selector: 'app-compliance-record',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './compliance-record.html',
})
export class ComplianceRecordComponent implements OnInit {
  records: ComplianceResponse[] = [];

  selectedRecord: ComplianceResponse | null = null;
  updateData: UpdateComplianceRequest = {
    result: '',
    notes: '',
  };
  isLoading = false;

  // Inject the service
  constructor(private complianceService: ComplianceService) {}

  // Fetch data automatically when the page loads
  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords() {
    this.complianceService.getAllCompliance().subscribe({
      next: (data) => {
        this.records = data;
      },
      error: (err) => console.error('Failed to load records:', err),
    });
  }

  // Utility method to dynamically assign colors based on the DB result
  getStatusColor(result: string): string {
    if (result === 'Compliant') return 'green';
    if (result === 'Non-Compliant') return 'red';
    return 'amber'; // Pending or default
  }

  selectForUpdate(record: ComplianceResponse) {
    this.selectedRecord = record;
    // Pre-fill the form with existing data
    this.updateData = { result: record.result, notes: record.notes || '' };

    // Smooth scroll to the form
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  }

  cancelUpdate() {
    this.selectedRecord = null;
  }

  saveUpdate() {
    if (this.selectedRecord && this.updateData.result) {
      this.isLoading = true;

      // Make the API PUT call
      this.complianceService.updateCompliance(this.selectedRecord.id, this.updateData).subscribe({
        next: (updatedRecord) => {
          // Update the local array so the UI refreshes instantly without reloading the page
          const index = this.records.findIndex((r) => r.id === updatedRecord.id);
          if (index !== -1) {
            this.records[index] = updatedRecord;
          }

          alert(`Successfully updated status for Record ID: ${updatedRecord.id}`);
          this.selectedRecord = null; // Close the form
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Failed to update record:', err);
          alert('Error updating record.');
          this.isLoading = false;
        },
      });
    }
  }
}
