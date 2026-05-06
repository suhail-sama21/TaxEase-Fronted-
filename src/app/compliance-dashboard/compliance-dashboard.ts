import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComplianceService } from '../services/compliance.service';
import { ComplianceDashboardResponse, ComplianceResponse } from '../models/compliance.model';

@Component({
  selector: 'app-compliance-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compliance-dashboard.html',
})
export class ComplianceDashboard implements OnInit {
  // State for the top cards
  metrics: ComplianceDashboardResponse = {
    totalChecks: 0,
    pendingReviews: 0,
    nonCompliant: 0,
    compliant: 0,
    systemHealth: 0,
  };

  // State for the recent table
  recentChecks: ComplianceResponse[] = [];

  constructor(private complianceService: ComplianceService) {}

  ngOnInit(): void {
    this.loadDashboardMetrics();
    this.loadRecentChecks();
  }

  loadDashboardMetrics() {
    this.complianceService.getDashboardSummary().subscribe({
      next: (data) => {
        // Round the health score to avoid decimals like 33.333%
        data.systemHealth = Math.round(data.systemHealth);
        this.metrics = data;
      },
      error: (err) => console.error('Failed to fetch dashboard metrics:', err),
    });
  }

  loadRecentChecks() {
    this.complianceService.getAllCompliance().subscribe({
      next: (data) => {
        // Sort by ID descending (newest first), then grab the first 5 records
        this.recentChecks = data.sort((a, b) => b.id - a.id).slice(0, 5);
      },
      error: (err) => console.error('Failed to fetch recent checks:', err),
    });
  }

  // Utility method to dynamically assign colors
  getStatusColor(result: string): string {
    if (result === 'Compliant') return 'green';
    if (result === 'Non-Compliant') return 'red';
    return 'amber'; // Pending
  }
}
