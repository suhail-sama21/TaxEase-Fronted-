import { Component, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
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
  // Use ViewChild to get the value directly from the textarea
  @ViewChild('urlInput') urlInput!: ElementRef<HTMLTextAreaElement>;

  // Upload States
  uploadFilingId: number | null = null;
  isSubmitting = false;
  isUploaded = false;
  uploadMessage = '';

  // Fetch States
  fetchFilingId: number | null = null;
  isFetching = false;
  fetchedDocs: any[] = [];
  fetchMessage = '';

  constructor(
    private documentService: DocumentService,
    private cdr: ChangeDetectorRef
  ) {}

  // The Link Button Logic
  submitUrl() {
    // Get value from ViewChild instead of passing it as a parameter
    const url = this.urlInput.nativeElement.value;

    if (!this.uploadFilingId || !url) {
      this.uploadMessage = 'Filing ID and URL are required.';
      return;
    }

    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.uploadMessage = 'Processing...';

    const payload = { filingId: Number(this.uploadFilingId), fileUrl: url };

    this.documentService.uploadDocument(payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.isUploaded = true;
        this.uploadMessage = 'Document linked successfully!';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isSubmitting = false;
        // CORS/Parsing workaround for 201 Created
        if (err.status === 0 || err.status === 201 || err.status === 200) {
          this.isUploaded = true;
          this.uploadMessage = 'Document linked successfully!';
        } else {
          this.uploadMessage = err.error?.message || 'Upload failed.';
        }
        this.cdr.detectChanges();
      }
    });
  }

  // The Fetch Button Logic
  loadDocuments() {
    if (!this.fetchFilingId) {
      this.fetchMessage = 'Please enter an ID.';
      return;
    }

    this.isFetching = true;
    this.fetchMessage = 'Searching...';
    this.fetchedDocs = [];

    this.documentService.getDocuments(this.fetchFilingId).subscribe({
      next: (docs) => {
        this.isFetching = false;
        this.fetchedDocs = docs;
        this.fetchMessage = docs.length > 0 ? '' : 'No documents found for this ID.';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.isFetching = false;
        this.fetchMessage = 'Failed to retrieve documents.';
        this.cdr.detectChanges();
      }
    });
  }

  resetUpload() {
    this.isUploaded = false;
    this.uploadMessage = '';
    this.cdr.detectChanges();
    // Use timeout to wait for the DOM to re-render the textarea
    setTimeout(() => {
      if (this.urlInput) this.urlInput.nativeElement.value = '';
    });
  }
}
