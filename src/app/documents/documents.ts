import { Component, OnInit, Input } from '@angular/core';
import { DocumentService } from '../service/document.service';
import { CommonModule } from '@angular/common'; // Fixes *ngIf, *ngFor, and | date
import { FormsModule } from '@angular/forms';   // Fixes [(ngModel)]


@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './documents.html'
})
export class DocumentsComponent implements OnInit {
  @Input() filingId!: number; // Passed from parent or route
  currentFilingId: number | null = null;
  uploadedDocs: any[] = [];
  isUploading = false;

  constructor(private documentService: DocumentService) {}

  ngOnInit() {
    if (this.filingId) {
      this.loadDocuments();
    }
  }

  loadDocuments() {
    this.documentService.getDocuments(this.filingId).subscribe(docs => {
      this.uploadedDocs = docs;
    });
  }

  submitUrl(url: string) {
    this.isUploading = true;
    const dto = { filingId: this.filingId, fileUrl: url };

    this.documentService.uploadDocument(dto).subscribe({
      next: (newDoc) => {
        this.uploadedDocs.unshift(newDoc);
        this.isUploading = false;
      },
      error: () => this.isUploading = false
    });
  }
}
