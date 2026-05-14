import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuditService } from '../core/services/audit.service';
import { AuditDashboardResponse, AuditResponse } from '../models/audit.model';
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-audit-cases',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audit-cases.html',
})
export class AuditCasesComponent implements OnInit {
  // Observable streams for the HTML async pipes
  metrics$!: Observable<AuditDashboardResponse>;
  filteredCases$!: Observable<AuditResponse[]>;

  // Subject to trigger filtering reactively
  private filterTrigger$ = new BehaviorSubject<void>(undefined);

  // Keep these for [(ngModel)] binding
  searchTerm: string = '';
  statusFilter: string = 'All Statuses';
  isLoading: boolean = true;

  constructor(
    private auditService: AuditService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // 1. Assign Metrics Observable
    this.metrics$ = this.auditService.getDashboardSummary();

    // 2. Setup Filtered Cases Observable
    const allAudits$ = this.auditService.getAllAudits().pipe(
      tap(() => this.isLoading = false),
      map(data => data.sort((a, b) => b.id - a.id))
    );

    // Combine the data stream with the filter trigger
    this.filteredCases$ = combineLatest([allAudits$, this.filterTrigger$]).pipe(
      map(([audits]) => {
        const term = this.searchTerm.toLowerCase();
        
        return audits.filter((audit) => {
          // Match ID, Scope, or Findings
          const matchesSearch =
            !term ||
            audit.id.toString().includes(term) ||
            (audit.scope && audit.scope.toLowerCase().includes(term)) ||
            (audit.findings && audit.findings.toLowerCase().includes(term));

          // Match Status dropdown
          const matchesStatus =
            this.statusFilter === 'All Statuses' ||
            (audit.status && audit.status.toUpperCase() === this.statusFilter.toUpperCase());

          return matchesSearch && matchesStatus;
        });
      })
    );
  }

  // This is called by (change) and (input) in your HTML
  applyFilters() {
    this.filterTrigger$.next();
  }

  getStatusColor(status: string): string {
    const s = status ? status.toUpperCase() : '';
    if (s === 'ACTIVE' || s === 'OPEN') return 'blue';
    if (s === 'INACTIVE' || s === 'CLOSED') return 'green';
    return 'amber';
  }

  createNewAudit() {
    this.router.navigate(['/portal/create-audit']);
  }

  viewDetails(id: number) {
    this.router.navigate(['/portal/view-audit', id]);
  }
}