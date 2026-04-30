import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-compliance-record',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './compliance-record.html'
})
export class ComplianceRecordComponent {

  // Mock data matching the screenshot's table
  records = [
    { id: 'CMP-1042', filingId: 'FIL-2026-089', taxpayer: 'Acme Corp', type: 'Filing', status: 'Compliant', statusColor: 'green', date: '2026-03-01' },
    { id: 'CMP-1043', filingId: 'FIL-2026-088', taxpayer: 'John Doe', type: 'Payment', status: 'Non-Compliant', statusColor: 'red', date: '2026-03-02' },
    { id: 'CMP-1044', filingId: 'FIL-2026-085', taxpayer: 'TechFlow LLC', type: 'Filing', status: 'Pending', statusColor: 'amber', date: '2026-03-03' }
  ];

  // State for the update form
  selectedRecord: any = null;
  updateData = {
    status: '',
    notes: ''
  };

  // Triggered when clicking "Update" in the table
  selectForUpdate(record: any) {
    this.selectedRecord = record;
    this.updateData = { status: record.status, notes: '' };

    // Smooth scroll to the update form
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }, 100);
  }

  cancelUpdate() {
    this.selectedRecord = null;
  }

  saveUpdate() {
    if (this.selectedRecord && this.updateData.status) {
      // Update the mock data state
      this.selectedRecord.status = this.updateData.status;

      // Map the color based on the new status
      if (this.updateData.status === 'Compliant') this.selectedRecord.statusColor = 'green';
      else if (this.updateData.status === 'Non-Compliant') this.selectedRecord.statusColor = 'red';
      else this.selectedRecord.statusColor = 'amber';

      alert(`Successfully updated status for ${this.selectedRecord.id}`);
      this.selectedRecord = null; // Close the form
    }
  }
}
