import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DocumentService } from '../service/document.service';

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './documents.html'
})
export class DocumentsComponent {
  // Upload States
  uploadFilingId: number | null = null;
  documentUrl: string = '';
  isValidUrl: boolean | null = null;
  isSubmitting = false;
  isUploaded = false;
  uploadMessage = '';
  showErrors = false;

  // Fetch States
  fetchFilingId: number | null = null;
  isFetching = false;
  fetchedDocs: any[] = [];
  fetchMessage = '';

  constructor(
    private documentService: DocumentService,
    private cdr: ChangeDetectorRef
  ) {}

  // Validate Document URL
  validateDocumentUrl() {
    if (!this.documentUrl || this.documentUrl.trim() === '') {
      this.isValidUrl = null;
      return;
    }

    // URL validation regex - checks for http/https and common document extensions
    const urlPattern = /^https?:\/\/.+\.(pdf|doc|docx|xls|xlsx|jpg|jpeg|png|gif|txt|zip)$/i;
    this.isValidUrl = urlPattern.test(this.documentUrl.trim());
  }

  // The Link Button Logic
  submitUrl() {
    this.showErrors = true;

    if (!this.uploadFilingId) {
      this.uploadMessage = 'Error: Filing ID is required';
      this.cdr.detectChanges();
      return;
    }

    if (!this.documentUrl || this.documentUrl.trim() === '') {
      this.uploadMessage = 'Error: Document URL is required';
      this.cdr.detectChanges();
      return;
    }

    if (this.isValidUrl === false) {
      this.uploadMessage = 'Error: Please enter a valid document URL (e.g., https://example.com/file.pdf)';
      this.cdr.detectChanges();
      return;
    }

    if (this.isSubmitting) return;

    this.isSubmitting = true;
    this.uploadMessage = 'Processing your document...';
    this.cdr.detectChanges();

    const payload = {
      filingId: Number(this.uploadFilingId),
      fileUrl: this.documentUrl.trim()
    };

    this.documentService.uploadDocument(payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.isUploaded = true;
        this.uploadMessage = 'Success: Document linked successfully!';
        this.showErrors = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSubmitting = false;

        // Handle specific error cases
        if (err.status === 400) {
          this.uploadMessage = 'Error: Invalid Filing ID or URL format. Please check and try again.';
        } else if (err.status === 404) {
          this.uploadMessage = 'Error: Filing ID not found. Please verify the ID.';
        } else if (err.status === 409) {
          this.uploadMessage = 'Error: This document URL is already registered for this filing.';
        } else if (err.status === 413) {
          this.uploadMessage = 'Error: File URL is too long. Please use a shorter URL.';
        } else if (err.status === 0 || err.status === 201 || err.status === 200) {
          // CORS/Parsing workaround for 201 Created
          this.isUploaded = true;
          this.uploadMessage = 'Success: Document linked successfully!';
          this.showErrors = false;
        } else if (err.error?.message) {
          this.uploadMessage = `Error: ${err.error.message}`;
        } else {
          this.uploadMessage = 'Error: Failed to link document. Please try again later.';
        }

        this.cdr.detectChanges();
      }
    });
  }

  // The Fetch Button Logic
  loadDocuments() {
    if (!this.fetchFilingId) {
      this.fetchMessage = 'Error: Please enter a Filing ID';
      this.cdr.detectChanges();
      return;
    }

    this.isFetching = true;
    this.fetchMessage = '';
    this.fetchedDocs = [];
    this.cdr.detectChanges();

    this.documentService.getDocuments(this.fetchFilingId).subscribe({
      next: (docs) => {
        this.isFetching = false;
        this.fetchedDocs = docs;

        if (docs.length === 0) {
          this.fetchMessage = 'No documents found for this Filing ID';
        }

        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isFetching = false;

        if (err.status === 404) {
          this.fetchMessage = 'Error: Filing ID not found in the system';
        } else if (err.status === 400) {
          this.fetchMessage = 'Error: Invalid Filing ID format';
        } else if (err.status === 0) {
          this.fetchMessage = 'Error: Network error. Please check your connection.';
        } else {
          this.fetchMessage = 'Error: Failed to retrieve documents. Please try again.';
        }

        this.fetchedDocs = [];
        this.cdr.detectChanges();
      }
    });
  }

  // Reset Upload Form
  resetUpload() {
    this.isUploaded = false;
    this.uploadFilingId = null;
    this.documentUrl = '';
    this.isValidUrl = null;
    this.uploadMessage = '';
    this.showErrors = false;
    this.cdr.detectChanges();
  }
}
