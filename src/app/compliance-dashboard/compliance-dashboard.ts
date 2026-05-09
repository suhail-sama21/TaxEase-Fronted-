import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplianceService } from '../services/compliance.service';
import { ComplianceDashboardResponse, ComplianceResponse } from '../models/compliance.model';
import { RouterModule } from '@angular/router'; // Ensure this is imported for your routerLinks!

@Component({
  selector: 'app-compliance-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './compliance-dashboard.html',
})
export class ComplianceDashboard implements OnInit {
  // --- ADD THIS VARIABLE ---
  errorMessage = '';

  metrics: ComplianceDashboardResponse = {
    totalChecks: 0,
    pendingReviews: 0,
    nonCompliant: 0,
    compliant: 0,
    systemHealth: 0,
  };

  recentChecks: ComplianceResponse[] = [];

  constructor(private complianceService: ComplianceService) {}

  ngOnInit(): void {
    this.loadDashboardMetrics();
    this.loadRecentChecks();
  }

  loadDashboardMetrics() {
    this.complianceService.getDashboardSummary().subscribe({
      next: (data) => {
        data.systemHealth = Math.round(data.systemHealth);
        this.metrics = data;
      },
      error: (err) => {
        console.error('Failed to fetch dashboard metrics:', err);
        // Set the on-screen message
        this.errorMessage =
          'Failed to load dashboard metrics. Please check your backend connection.';
      },
    });
  }

  loadRecentChecks() {
    this.complianceService.getAllCompliance().subscribe({
      next: (data) => {
        this.recentChecks = data.sort((a, b) => b.id - a.id).slice(0, 5);
      },
      error: (err) => {
        console.error('Failed to fetch recent checks:', err);
        // Set the on-screen message
        this.errorMessage = 'Failed to load recent compliance checks.';
      },
    });
  }

  getStatusColor(result: string): string {
    if (result === 'Compliant') return 'green';
    if (result === 'Non-Compliant') return 'red';
    return 'amber';
  }
}
