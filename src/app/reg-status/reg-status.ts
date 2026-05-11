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
  private previousProgress = 0;
  progressChanged = false;

  ngOnInit(): void {
    this.fetchDocuments();
  }

  constructor(private service: TaxpayerService) {}

  taxpayerId = 'TXP-2026-00142';
  regDate = 'March 1, 2026';
  lastUpdated = 'March 5, 2026';

  // Dynamic timeline data based on document verification progress
  get timelineSteps() {
    const verifiedCount = this.taxpayerDocuments.filter(doc => doc.verificationStatus === 'Accepted').length;
    const totalDocs = 3; // ID Proof, PAN Card, Address Proof
    const progressPercent = (verifiedCount / totalDocs) * 100;

    if (progressPercent === 100) {
      return [
        { title: 'Application Submitted', date: 'March 1, 2026', status: 'completed' },
        { title: 'Documents Received', date: 'March 2, 2026', status: 'completed' },
        { title: 'Under Review', date: 'March 3-5, 2026', status: 'completed' },
        { title: 'ID Assigned', date: 'March 6, 2026', status: 'completed' }
      ];
    } else if (progressPercent >= 75) {
      return [
        { title: 'Application Submitted', date: 'March 1, 2026', status: 'completed' },
        { title: 'Documents Received', date: 'March 2, 2026', status: 'completed' },
        { title: 'Under Review', date: 'In progress — ' + Math.round(progressPercent) + '% verified', status: 'current' },
        { title: 'ID Assigned', date: 'Pending', status: 'upcoming' }
      ];
    } else if (progressPercent >= 50) {
      return [
        { title: 'Application Submitted', date: 'March 1, 2026', status: 'completed' },
        { title: 'Documents Received', date: 'March 2, 2026', status: 'completed' },
        { title: 'Under Review', date: 'In progress — ' + Math.round(progressPercent) + '% verified', status: 'current' },
        { title: 'ID Assigned', date: 'Pending', status: 'upcoming' }
      ];
    } else if (verifiedCount > 0) {
      return [
        { title: 'Application Submitted', date: 'March 1, 2026', status: 'completed' },
        { title: 'Documents Received', date: 'March 2, 2026', status: 'completed' },
        { title: 'Under Review', date: 'In progress — ' + Math.round(progressPercent) + '% verified', status: 'current' },
        { title: 'ID Assigned', date: 'Pending', status: 'upcoming' }
      ];
    } else {
      return [
        { title: 'Application Submitted', date: 'March 1, 2026', status: 'completed' },
        { title: 'Documents Received', date: 'March 2, 2026', status: 'completed' },
        { title: 'Under Review', date: 'Pending document verification', status: 'current' },
        { title: 'ID Assigned', date: 'Pending', status: 'upcoming' }
      ];
    }
  }

  // Progress bar calculation
  get verificationProgress() {
    const verifiedCount = this.taxpayerDocuments.filter(doc => doc.verificationStatus === 'Accepted').length;
    return Math.round((verifiedCount / 3) * 100); // 3 required documents
  }

  // Status badge text based on progress
  get statusBadge() {
    const progress = this.verificationProgress;
    if (progress === 100) {
      return { text: 'VERIFICATION COMPLETE', color: '#3fb950' };
    } else if (progress >= 75) {
      return { text: 'MOSTLY VERIFIED', color: '#e3b341' };
    } else if (progress >= 25) {
      return { text: 'PARTIALLY VERIFIED', color: '#e3b341' };
    } else {
      return { text: 'PENDING VERIFICATION', color: '#e3b341' };
    }
  }

  // TrackBy function for timeline steps to optimize rendering
  trackByStep(index: number, step: any): string {
    return step.title + step.status;
  }

  refreshStatus() {
    this.fetchDocuments();
  }

  fetchDocuments() {
  // We assign the Observable itself to the variable
    this.requiredDocs$ = this.service.getDocuments().pipe(
      map(data => {
        console.log('Documents fetched successfully:', data);
        this.taxpayerDocuments = data;

        // Check if progress changed for animation
        const newProgress = this.verificationProgress;
        if (newProgress !== this.previousProgress) {
          this.progressChanged = true;
          setTimeout(() => this.progressChanged = false, 1000); // Reset after animation
          this.previousProgress = newProgress;
        }

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
    // 1. Capture the ID into a local variable immediately
    const targetId = this.verificationTarget?.id;

    if (!targetId) {
      console.error("No document ID found for verification");
      return;
    }

    // 2. Now it's safe to close/clear the modal state
    this.closeVerifyModal();

    // 3. Use the local variable for the service call
    this.service.verifyDocument(targetId, status).subscribe({
      next: () => this.fetchDocuments(),
      error: (err) => console.error("Verification failed", err)
    })
    
     // Ensure we refresh the document list after verification
  }

  private transformDocuments(documents: taxpayerDocument[]): DocumentRow[] {
    const allTypes = [
      { type: 'ID Proof', backendType: 'ID Proof' },
      { type: 'PAN Card', backendType: 'PAN' },
      { type: 'Address Proof', backendType: 'Address proof' }
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
