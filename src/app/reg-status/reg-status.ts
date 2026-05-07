import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxpayerService } from '../service/taxpayer-service';
import { AsyncPipe } from '@angular/common';
import { OnInit } from '@angular/core';
import { taxpayerDocument } from '../dto/taxpayer-profile';

@Component({
  selector: 'app-reg-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reg-status.html'
})
export class RegStatusComponent implements OnInit{
  
  taxpayerDocuments: taxpayerDocument[]= [];

  ngOnInit(): void {
    this.loadDocuments();
  }

  constructor(private service: TaxpayerService){}

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

  // Required documents table data
  requiredDocs: any[] = [];

  refreshStatus() {
    this.loadDocuments();
  }
  loadDocuments(){
    let obj = this.service.getDocuments()
    if (obj){
      obj.subscribe((data) => {
        console.log('Documents fetched successfully:', data);
        this.taxpayerDocuments = data;
        this.requiredDocs = this.transformDocuments(data);
      });
    }
  }

  private transformDocuments(documents: taxpayerDocument[]): any[] {
    const mapped = documents.map(doc => ({
      type: this.mapDocType(doc.docType),
      date: doc.uploadedDate.split('T')[0],
      status: doc.verificationStatus,
      statusColor: this.getStatusColor(doc.verificationStatus)
    }));

    // Add missing document types
    const existingTypes = mapped.map(d => d.type);
    const allTypes = ['ID Proof', 'PAN Card', 'Address Proof', 'Income Proof'];
    allTypes.forEach(type => {
      if (!existingTypes.includes(type)) {
        mapped.push({
          type,
          date: '—',
          status: 'Missing',
          statusColor: 'red'
        });
      }
    });

    return mapped;
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
        return 'green';
      case 'Pending':
        return 'amber';
      case 'Missing':
        return 'red';
      default:
        return 'red';
    }
  }
}