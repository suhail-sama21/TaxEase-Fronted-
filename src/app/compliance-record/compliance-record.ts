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

  // Added message state variables
  successMessage = '';
  errorMessage = '';

  constructor(private complianceService: ComplianceService) {}

  ngOnInit() {
    this.loadRecords();
  }

  loadRecords() {
    this.complianceService.getAllCompliance().subscribe({
      next: (data) => {
        this.records = data;
      },
      error: (err) => {
        console.error('Failed to load records:', err);
        this.errorMessage = 'Failed to load compliance records from the server.';
      },
    });
  }

  getStatusColor(result: string): string {
    if (result === 'Compliant') return 'green';
    if (result === 'Non-Compliant') return 'red';
    return 'amber';
  }

  selectForUpdate(record: ComplianceResponse) {
    this.selectedRecord = record;
    this.updateData = { result: record.result, notes: record.notes || '' };
    this.errorMessage = ''; // Clear any old errors

    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  }

  cancelUpdate() {
    this.selectedRecord = null;
    this.errorMessage = '';
  }

  saveUpdate() {
    if (this.selectedRecord && this.updateData.result) {
      this.isLoading = true;
      this.successMessage = '';
      this.errorMessage = '';

      this.complianceService.updateCompliance(this.selectedRecord.id, this.updateData).subscribe({
        next: (updatedRecord) => {
          const index = this.records.findIndex((r) => r.id === updatedRecord.id);
          if (index !== -1) {
            this.records[index] = updatedRecord;
          }

          // Set success message instead of alert
          this.successMessage = `Successfully updated status for Record ID: CMP-${updatedRecord.id}`;
          this.selectedRecord = null;
          this.isLoading = false;

          // Auto-hide the success message after 4 seconds
          setTimeout(() => {
            this.successMessage = '';
          }, 4000);
        },
        error: (err) => {
          console.error('Failed to update record:', err);
          // Set error message instead of alert
          this.errorMessage = 'Error updating record. Please try again.';
          this.isLoading = false;
        },
      });
    }
  }
}
