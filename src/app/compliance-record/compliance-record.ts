import { Component, OnInit, inject, NgZone } from '@angular/core';
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
  private ngZone = inject(NgZone);

  records: ComplianceResponse[] = [];
  selectedRecord: ComplianceResponse | null = null;
  updateData: UpdateComplianceRequest = { result: '', notes: '' };

  isLoading = false;

  errorMessage = '';
  successMessage = '';

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

    this.errorMessage = '';
    this.successMessage = '';

    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  }

  cancelUpdate() {
    this.selectedRecord = null;
    this.errorMessage = '';
    this.successMessage = '';
  }

  saveUpdate() {
    if (this.selectedRecord && this.updateData.result) {
      this.isLoading = true;
      this.successMessage = '';
      this.errorMessage = '';

      this.complianceService.updateCompliance(this.selectedRecord.id, this.updateData).subscribe({
        next: (updatedRecord) => {
          this.ngZone.run(() => {
            const index = this.records.findIndex((r) => r.id === updatedRecord.id);
            if (index !== -1) {
              this.records[index] = updatedRecord;
            }

            this.isLoading = false;
            this.successMessage = `Successfully updated status for Record ID: CMP-${updatedRecord.id}`;

            setTimeout(() => {
              this.ngZone.run(() => {
                this.cancelUpdate();
              });
            }, 2500);
          });
        },

        error: (err: any) => {
          this.ngZone.run(() => {
            console.error('Failed to update record:', err);
            this.isLoading = false;
            this.errorMessage = err.message || 'Error updating record. Please try again.';
          });
        },
      });
    }
  }
}
