import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Matches package com.cognizant.taxFilingService.dto.requestdto.FilingDocumentRequestDTO
export interface FilingDocumentRequestDTO {
  filingId: number;
  fileUrl: string;
}

// Matches package com.cognizant.taxFilingService.entity.FilingDocument
export interface FilingDocument {
  id: number;
  fileUrl: string;
  uploadedDate: string; // From Instant in Java
}

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './documents.html'
})
export class DocumentsComponent {
  isUploading = false;
  currentFilingId: number | null = null;

  // Local list to display files associated with the filing
  uploadedDocs: FilingDocument[] = [
    { id: 1, fileUrl: 'https://tax-docs.s3.amazonaws.com/101/pan_copy.pdf', uploadedDate: '2026-04-10T10:00:00Z' },
    { id: 2, fileUrl: 'https://tax-docs.s3.amazonaws.com/101/income_stmt.pdf', uploadedDate: '2026-04-12T14:30:00Z' }
  ];

  submitUrl(url: string) {
    if (!url || !this.currentFilingId) {
      alert("Filing ID and Document URL are required.");
      return;
    }

    this.isUploading = true;

    // Creating payload for FilingDocumentController
    const payload: FilingDocumentRequestDTO = {
      filingId: this.currentFilingId,
      fileUrl: url
    };

    console.log("POST /api/documents/upload Payload:", payload);

    // Simulate service call
    setTimeout(() => {
      const mockResponse: FilingDocument = {
        id: Math.floor(Math.random() * 1000),
        fileUrl: payload.fileUrl,
        uploadedDate: new Date().toISOString()
      };

      this.uploadedDocs.unshift(mockResponse);
      this.isUploading = false;
    }, 1200);
  }
}
