import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './layout.html'
})
export class LayoutComponent {
  // Hardcoded for now, but you will later populate this from your IdentityService
  userName = 'John Doe';
  userInitials = 'JD';
  userRole = 'Taxpayer';
  notificationCount = 2;

  // Menu items for easy iteration in the template
  navItems = [
    { label: 'Dashboard', route: '/dashboard', icon: 'dashboard-icon' },
    { label: 'Profile', route: '/profile', icon: 'profile-icon' },
    { label: 'Reg. Status', route: '/status', icon: 'status-icon' },
    { label: 'Documents', route: '/documents', icon: 'docs-icon' },
    { label: 'My Filings', route: '/filings', icon: 'filings-icon', badge: 3 },
    { label: 'File Taxes', route: '/file-taxes', icon: 'file-icon' },
    { label: 'Make Payment', route: '/payment', icon: 'pay-icon' },
    { label: 'Payment History', route: '/history', icon: 'history-icon' },
    { label: 'Notifications', route: '/notifications', icon: 'bell-icon', badge: 2 }
  ];
}