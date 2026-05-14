import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ComplianceService } from '../core/services/compliance.service';
import { ComplianceResponse, UpdateComplianceRequest } from '../models/compliance.model';
import { Observable, BehaviorSubject, map, catchError, of } from 'rxjs';

@Component({
  selector: 'app-compliance-record',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './compliance-record.html',
})
export class ComplianceRecordComponent implements OnInit {
  private complianceService = inject(ComplianceService);

  // 1. BehaviorSubject acts as the "source of truth" for your data
  private recordsSubject = new BehaviorSubject<ComplianceResponse[]>([]);
  
  // 2. The HTML will subscribe to this via | async
  records$: Observable<ComplianceResponse[]> = this.recordsSubject.asObservable();

  selectedRecord: ComplianceResponse | null = null;
  updateData: UpdateComplianceRequest = { result: '', notes: '' };
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit() {
    this.loadRecords();
  }

  loadRecords() {
    this.complianceService.getAllCompliance().pipe(
      catchError(err => {
        console.error('Failed to load records:', err);
        this.errorMessage = 'Failed to load compliance records from the server.';
        return of([]); // Return empty array on error
      })
    ).subscribe(data => {
      this.recordsSubject.next(data); // Push data into the stream
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
          // --- FIXED INDEX LOGIC FOR OBSERVABLES ---
          const currentRecords = this.recordsSubject.value; // Get the current array
          const updatedList = currentRecords.map(r => 
            r.id === updatedRecord.id ? updatedRecord : r
          );
          
          this.recordsSubject.next(updatedList); // Update the stream (HTML refreshes automatically)
          
          this.isLoading = false;
          this.successMessage = `Successfully updated Record ID: CMP-${updatedRecord.id}`;

          setTimeout(() => {
            this.cancelUpdate();
          }, 2500);
        },
        error: (err: any) => {
          console.error('Failed to update record:', err);
          this.isLoading = false;
          this.errorMessage = err.message || 'Error updating record. Please try again.';
        },
      });
    }
  }
}