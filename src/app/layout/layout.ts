import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink } from '@angular/router';
import { OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectUser } from '../stores/authStore/auth.features';
import { Observable , of} from 'rxjs';
import { NotificationService } from '../core/services/notification';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink],
  templateUrl: './layout.html',
})
export class LayoutComponent implements OnInit {
  
  userName$!: Observable<string>;
  userInitials = 'JD';
  userRole$!: Observable<string>;
  notificationCount = 2;
  isDarkMode = true;
  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
  }

  constructor(private store: Store,
              private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.store.select(selectUser).subscribe(user => {
      if (user) {
        this.userName$ = of(user.name);
        this.userRole$ = of(user.role);
        console.log('User data from store:', user); // Debug log to check user data
        console.log('User name:', this.userName$); // Debug log to check userName assignment
        console.log('User role:', this.userRole$); // Debug log to check userRole assignment
      }
    });

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
    { label: 'Notifications', route: '/portal/notifications', icon: 'bell-icon', badge: 2 },
    { label: 'Revenue Dashboard', route: '/portal/reports/revenue', icon: 'chart-icon' },
    { label: 'Audit Dashboard', route: '/portal/reports/audit', icon: 'shield-icon' },
    { label: 'Payment Analytics', route: '/portal/reports/payments', icon: 'pay-icon' },
    { label: 'Report Exports', route: '/portal/reports/download', icon: 'download-icon' },
    { label: 'Compliance Hub', route: '/portal/compliance-dashboard', icon: 'shield-icon' },
    { label: 'Compliance Records', route: '/portal/compliance-records', icon: 'folder-icon' },
    { label: 'Create Record', route: '/portal/create-compliance', icon: 'plus-icon' },
    { label: 'Audit Cases', route: '/portal/audit-cases', icon: 'search-icon' },
    { label: 'Create Audit', route: '/portal/create-audit', icon: 'plus-circle-icon' },
    { label: 'View Audit', route: '/portal/view-audit', icon: 'plus-square-icon' }, 
    { label: 'Send Notification', route: '/portal/send-notification', icon: 'send-icon' }
  ];
}
