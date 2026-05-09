import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxpayerService } from '../service/taxpayer-service';
import { AsyncPipe } from '@angular/common';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-reg-status',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reg-status.html',
})
export class RegStatusComponent implements OnInit {
  ngOnInit(): void {
    this.addDummy();
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
    { title: 'ID Assigned', date: 'Pending', status: 'upcoming' },
  ];

  // Required documents table data
  requiredDocs = [
    { type: 'ID Proof', date: '2026-03-02', status: 'Verified', statusColor: 'green' },
    { type: 'PAN Card', date: '2026-03-02', status: 'Verified', statusColor: 'green' },
    { type: 'Address Proof', date: '2026-03-03', status: 'Pending', statusColor: 'amber' },
    { type: 'Income Proof', date: '—', status: 'Missing', statusColor: 'red' },
  ];

  refreshStatus() {
    alert('Checking for updates from the compliance server...');
  }
  addDummy() {
    let obj = this.service.getDocuments();
    if (obj) {
      obj.subscribe((data) => {
        console.log('Documents fetched successfully:', data);
      });
    }
  }
}
