import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplianceService } from '../services/compliance.service';
import { ComplianceDashboardResponse, ComplianceResponse } from '../models/compliance.model';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators'; // Add this import

@Component({
  selector: 'app-compliance-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './compliance-dashboard.html',
})
export class ComplianceDashboard implements OnInit {
  // 1. Assign the Observable directly from the service
  metrics$!: Observable<ComplianceDashboardResponse>;
  recentChecks$!: Observable<ComplianceResponse[]>;

  constructor(private complianceService: ComplianceService) {}

  ngOnInit(): void {
    this.loadDashboardMetrics();
    this.loadRecentChecks();
  }

  loadDashboardMetrics() {
    // 2. Do NOT .subscribe() here. Use .pipe() to transform data.
    this.metrics$ = this.complianceService.getDashboardSummary().pipe(
      map((data) => ({
        ...data,
        systemHealth: Math.round(data.systemHealth),
      })),
    );
  }

  loadRecentChecks() {
    // 3. Chain the sorting logic directly into the stream
    this.recentChecks$ = this.complianceService
      .getAllCompliance()
      .pipe(map((data) => data.sort((a, b) => b.id - a.id).slice(0, 5)));
  }

  getStatusColor(result: string): string {
    // Note: Match the casing of your Database/Enum exactly!
    if (result === 'COMPLIANT' || result === 'Compliant') return 'green';
    if (result === 'NON-COMPLIANT' || result === 'Non-Compliant') return 'red';
    return 'amber';
  }
}
