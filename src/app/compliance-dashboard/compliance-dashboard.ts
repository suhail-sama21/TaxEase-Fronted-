import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplianceService } from '../services/compliance.service';
import { ComplianceDashboardResponse, ComplianceResponse } from '../models/compliance.model';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-compliance-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './compliance-dashboard.html',
})
export class ComplianceDashboard implements OnInit {
  metrics$!: Observable<ComplianceDashboardResponse>;
  recentChecks$!: Observable<ComplianceResponse[]>;
  errorMessage: any;

  constructor(private complianceService: ComplianceService) {}

  ngOnInit(): void {
    this.loadDashboardMetrics();
    this.loadRecentChecks();
  }

  loadDashboardMetrics() {
    this.metrics$ = this.complianceService.getDashboardSummary().pipe(
      map((data) => ({
        ...data,
        systemHealth: Math.round(data.systemHealth),
      })),
    );
  }

  loadRecentChecks() {
    this.recentChecks$ = this.complianceService
      .getAllCompliance()
      .pipe(map((data) => data.sort((a, b) => b.id - a.id).slice(0, 5)));
  }

  getStatusColor(result: string): string {
    if (result === 'COMPLIANT' || result === 'Compliant') return 'green';
    if (result === 'NON-COMPLIANT' || result === 'Non-Compliant') return 'red';
    return 'amber';
  }
}
