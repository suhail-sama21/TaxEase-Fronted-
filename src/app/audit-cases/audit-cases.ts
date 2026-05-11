import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuditService } from '../services/audit.service';
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
  metrics$!: Observable<AuditDashboardResponse>;
  filteredCases$!: Observable<AuditResponse[]>;

  private filterTrigger$ = new BehaviorSubject<void>(undefined);

  searchTerm: string = '';
  statusFilter: string = 'All Statuses';
  isLoading: boolean = true;

  constructor(
    private auditService: AuditService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.metrics$ = this.auditService.getDashboardSummary();

    const allAudits$ = this.auditService.getAllAudits().pipe(
      tap(() => (this.isLoading = false)),
      map((data) => data.sort((a, b) => b.id - a.id)),
    );

    this.filteredCases$ = combineLatest([allAudits$, this.filterTrigger$]).pipe(
      map(([audits]) => {
        const term = this.searchTerm.toLowerCase();

        return audits.filter((audit) => {
          const matchesSearch =
            !term ||
            audit.id.toString().includes(term) ||
            (audit.scope && audit.scope.toLowerCase().includes(term)) ||
            (audit.findings && audit.findings.toLowerCase().includes(term));

          const matchesStatus =
            this.statusFilter === 'All Statuses' ||
            (audit.status && audit.status.toUpperCase() === this.statusFilter.toUpperCase());

          return matchesSearch && matchesStatus;
        });
      }),
    );
  }

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
