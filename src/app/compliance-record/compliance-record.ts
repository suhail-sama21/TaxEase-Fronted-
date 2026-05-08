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
  // 1. Inject NgZone instead of ChangeDetectorRef
  private ngZone = inject(NgZone); 

  records: ComplianceResponse[] = [];
  selectedRecord: ComplianceResponse | null = null;
  updateData: UpdateComplianceRequest = { result: '', notes: '' };
  
  isLoading = false;
  errorMessage: string | null = null;   
  successMessage: string | null = null; 

  constructor(private complianceService: ComplianceService) {}

  ngOnInit() {
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

  getStatusColor(result: string): string {
    if (result === 'Compliant') return 'green';
    if (result === 'Non-Compliant') return 'red';
    return 'amber';
  }

  selectForUpdate(record: ComplianceResponse) {
    this.selectedRecord = record;
    this.updateData = { result: record.result, notes: record.notes || '' };
    
    // Reset messages when opening a new record
    this.errorMessage = null; 
    this.successMessage = null;

    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  }

  cancelUpdate() {
    this.selectedRecord = null;
    this.errorMessage = null;
    this.successMessage = null;
  }

  saveUpdate() {
    if (this.selectedRecord && this.updateData.result) {
      this.isLoading = true;
      this.errorMessage = null;
      this.successMessage = null;

      this.complianceService.updateCompliance(this.selectedRecord.id, this.updateData).subscribe({
        next: (updatedRecord) => {
          // 2. Wrap the success update inside NgZone
          this.ngZone.run(() => {
            const index = this.records.findIndex((r) => r.id === updatedRecord.id);
            if (index !== -1) {
              this.records[index] = updatedRecord;
            }

            this.isLoading = false;
            this.successMessage = `Successfully updated status for Record ID: ${updatedRecord.id}`;
            
            // Auto-close the form after 2 seconds
            setTimeout(() => {
              this.ngZone.run(() => {
                 this.cancelUpdate();
              });
            }, 2000);
          });
        },
        error: (err: Error) => {
          // 3. Wrap the error update inside NgZone to force instant UI refresh
          this.ngZone.run(() => {
            this.isLoading = false;
            this.errorMessage = err.message || 'Failed to update record.'; 
          });
        },
      });
    }
  }
}