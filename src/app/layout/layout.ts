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
  isDarkMode = true;
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
  }

  // Menu items updated with the new '/portal' base path
  navItems = [
    { label: 'Dashboard', route: '/portal/dashboard', icon: 'dashboard-icon' },
    { label: 'Profile', route: '/portal/profile', icon: 'profile-icon' },
    { label: 'Reg. Status', route: '/portal/status', icon: 'status-icon' },
    { label: 'Documents', route: '/portal/documents', icon: 'docs-icon' },
    { label: 'My Filings', route: '/portal/filings', icon: 'filings-icon', badge: 3 },
    { label: 'File Taxes', route: '/portal/file-taxes', icon: 'file-icon' },
    { label: 'Make Payment', route: '/portal/payment', icon: 'pay-icon' },
    { label: 'Payment History', route: '/portal/history', icon: 'history-icon' },
    { label: 'Notifications', route: '/portal/notifications', icon: 'bell-icon', badge: 2 }
  ];
}