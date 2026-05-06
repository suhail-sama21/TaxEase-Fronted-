import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // CRITICAL for [(ngModel)]
import { Router } from '@angular/router';
import { AuditService } from '../services/audit.service';
import { AuditDashboardResponse, AuditResponse } from '../models/audit.model';

@Component({
  selector: 'app-audit-cases',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit-cases.html',
})
export class AuditCasesComponent implements OnInit {
  // Initialize with 0s to prevent undefined HTML errors before data loads
  metrics: AuditDashboardResponse = {
    totalCases: 0,
    open: 0,
    inProgress: 0,
    closed: 0,
  };

  auditCases: AuditResponse[] = [];
  filteredCases: AuditResponse[] = [];

  // Filter States
  searchTerm: string = '';
  statusFilter: string = 'All Statuses';
  isLoading: boolean = true;

  constructor(
    private auditService: AuditService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;

    // 1. Fetch Top Metrics
    this.auditService.getDashboardSummary().subscribe({
      next: (data) => (this.metrics = data),
      error: (err) => console.error('Error loading metrics:', err),
    });

    // 2. Fetch Table Data
    this.auditService.getAllAudits().subscribe({
      next: (data) => {
        // Sort descending so newest cases are at the top
        const sortedData = data.sort((a, b) => b.id - a.id);
        this.auditCases = sortedData;
        this.filteredCases = sortedData;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading cases:', err);
        this.isLoading = false;
      },
    });
  }

  // Live Filtering Logic
  applyFilters() {
    this.filteredCases = this.auditCases.filter((audit) => {
      const term = this.searchTerm.toLowerCase();

      // Match ID, Scope, or Findings safely
      const matchesSearch =
        !term ||
        audit.id.toString().includes(term) ||
        (audit.scope && audit.scope.toLowerCase().includes(term)) ||
        (audit.findings && audit.findings.toLowerCase().includes(term));

      // Match Status dropdown safely
      const matchesStatus =
        this.statusFilter === 'All Statuses' ||
        (audit.status && audit.status.toUpperCase() === this.statusFilter.toUpperCase());

      return matchesSearch && matchesStatus;
    });
  }

  // Dynamic status colors
  getStatusColor(status: string): string {
    const s = status ? status.toUpperCase() : '';
    if (s === 'ACTIVE' || s === 'OPEN') return 'blue';
    if (s === 'INACTIVE' || s === 'CLOSED') return 'green';
    return 'amber'; // Default/Pending
  }

  createNewAudit() {
    this.router.navigate(['/portal/create-audit']);
  }

  viewDetails(id: number) {
    this.router.navigate(['/portal/view-audit', id]);
  }
}
