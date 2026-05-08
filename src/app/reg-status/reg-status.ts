import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaxpayerService } from '../service/taxpayer-service';
import { OnInit } from '@angular/core';
import { taxpayerDocument } from '../dto/taxpayer-profile';
import { Observable, map } from 'rxjs';

interface DocumentRow {
  type: string;
  backendDocType: string;
  date: string;
  status: string;
  statusColor: string;
  fileUri: string | null;
  id?: number;
}

@Component({
  selector: 'app-reg-status',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reg-status.html'
})
export class RegStatusComponent implements OnInit {
  taxpayerDocuments: taxpayerDocument[] = [];
  requiredDocs$!: Observable<DocumentRow[]>;
  activeDoc?: DocumentRow;
  documentInputUrl = '';
  isUploadModalOpen = false;
  isVerifyModalOpen = false;
  verificationTarget?: DocumentRow;

  ngOnInit(): void {
    this.fetchDocuments();
  }

  constructor(private service: TaxpayerService) {}

  taxpayerId = 'TXP-2026-00142';
  regDate = 'March 1, 2026';
  lastUpdated = 'March 5, 2026';

  // Timeline data
  timelineSteps = [
    { title: 'Application Submitted', date: 'March 1, 2026', status: 'completed' },
    { title: 'Documents Received', date: 'March 2, 2026', status: 'completed' },
    { title: 'Under Review', date: 'In progress — Est. March 10, 2026', status: 'current' },
    { title: 'ID Assigned', date: 'Pending', status: 'upcoming' }
  ];

  refreshStatus() {
    this.fetchDocuments();
  }

  fetchDocuments() {
  // We assign the Observable itself to the variable
    this.requiredDocs$ = this.service.getDocuments().pipe(
      map(data => {
        console.log('Documents fetched successfully:', data);
        this.taxpayerDocuments = data;
        return this.transformDocuments(data); // Returns the array to the stream
      })
    );
  }

  openUploadModal(doc: DocumentRow) {
    this.activeDoc = doc;
    this.documentInputUrl = doc.fileUri ?? '';
    this.isUploadModalOpen = true;
  }

  closeUploadModal() {
    this.isUploadModalOpen = false;
    this.activeDoc = undefined;
    this.documentInputUrl = '';
  }

  submitDocument() {
    if (!this.activeDoc) {
      return;
    }

    const payloadDocType = this.activeDoc.backendDocType;
    const fileUri = this.documentInputUrl.trim();
    if (!fileUri) {
      return;
    }

    const request$ = this.activeDoc.id
      ? this.service.updateDocument(this.activeDoc.id, payloadDocType, fileUri)
      : this.service.uploadDocument(payloadDocType, fileUri);

    request$.subscribe(() => {
      this.closeUploadModal();
      this.fetchDocuments();
    });
  }

  openVerifyModal(doc: DocumentRow) {
    if (!doc.id || !doc.fileUri || doc.statusColor === 'green') {
      return;
    }
    this.verificationTarget = doc;
    this.isVerifyModalOpen = true;
  }

  closeVerifyModal() {
    this.isVerifyModalOpen = false;
    this.verificationTarget = undefined;
  }

  verifyDocument(status: 'Accepted' | 'Rejected') {
    if (!this.verificationTarget?.id) {
      return;
    }

    this.service.verifyDocument(this.verificationTarget.id, status).subscribe(() => {
      this.closeVerifyModal();
      this.fetchDocuments();
    });
  }

  private transformDocuments(documents: taxpayerDocument[]): DocumentRow[] {
    const allTypes = [
      { type: 'ID Proof', backendType: 'ID Proof' },
      { type: 'PAN Card', backendType: 'PAN' },
      { type: 'Address Proof', backendType: 'Address proof' },
      { type: 'Income Proof', backendType: 'Income Proof' }
    ];

    return allTypes.map(typeInfo => {
      const matchingDoc = documents.find(doc => this.mapDocType(doc.docType) === typeInfo.type);
      if (matchingDoc) {
        return {
          type: typeInfo.type,
          backendDocType: typeInfo.backendType,
          date: matchingDoc.uploadedDate.split('T')[0],
          status: matchingDoc.verificationStatus,
          statusColor: this.getStatusColor(matchingDoc.verificationStatus),
          fileUri: matchingDoc.fileUri,
          id: matchingDoc.id
        };
      }
      return {
        type: typeInfo.type,
        backendDocType: typeInfo.backendType,
        date: '—',
        status: 'Missing',
        statusColor: 'red',
        fileUri: null
      };
    });
  }

  private mapDocType(docType: string): string {
    switch (docType) {
      case 'PAN':
        return 'PAN Card';
      case 'ID Proof':
        return 'ID Proof';
      case 'Address proof':
        return 'Address Proof';
      default:
        return docType;
    }
  }

  private getStatusColor(status: string): string {
    switch (status) {
      case 'Verified':
      case 'Accepted':
        return 'green';
      case 'Pending':
        return 'amber';
      case 'Missing':
      case 'Rejected':
        return 'red';
      default:
        return 'red';
    }
  }
}