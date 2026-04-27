import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './documents.html'
})
export class DocumentsComponent {
  isUploading = false;
  
  // Mock data for uploaded documents
  uploadedDocs = [
    { id: 'DOC-001', type: 'ID Proof', date: '2025-01-15', status: 'Verified', statusColor: 'green' },
    { id: 'DOC-002', type: 'PAN Card', date: '2025-01-15', status: 'Verified', statusColor: 'green' },
    { id: 'DOC-003', type: 'Business License', date: '2026-03-05', status: 'Pending', statusColor: 'amber' }
  ];

  triggerUpload() {
    this.isUploading = true;
    
    // Simulate an upload delay
    setTimeout(() => {
      this.isUploading = false;
      
      // Add a mock newly uploaded document to the top of the list
      this.uploadedDocs.unshift({
        id: 'DOC-00' + (Math.floor(Math.random() * 90) + 10),
        type: 'Address Proof',
        date: new Date().toISOString().split('T')[0],
        status: 'Under Review',
        statusColor: 'blue'
      });
      
    }, 1500);
  }
}