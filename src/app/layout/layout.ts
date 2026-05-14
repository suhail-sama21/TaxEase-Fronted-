import { Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router'; // Added Router & NavigationEnd
import { Store } from '@ngrx/store';
import { selectUser } from '../stores/authStore/auth.features';
import { map, switchMap, Observable, of, startWith, filter, combineLatest } from 'rxjs';
import { logout } from '../stores/authStore/auth.action';
import { NotificationService } from '../core/services/notification';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, AsyncPipe],
  templateUrl: './layout.html',
})
export class LayoutComponent {
  private store = inject(Store);
  private notificationService = inject(NotificationService);
  private router = inject(Router); // Inject Router

  constructor() {
    // Trigger the count updates on navigation
    this.triggerCountUpdate$.subscribe();
  }

  // 1. Core User Streams
  // Modal State
  showLogoutModal = false;

  // Reactive User Data
  user$ = this.store.select(selectUser);
  userId$ = this.user$.pipe(map(u => u?.id));

  // 2. Navigation Trigger Stream
  // Emits every time a route change successfully finishes
  private navigationEnd$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    startWith(null) // Emit immediately so the count loads on first page hit
  );

  // 3. Notification Stream (Reactive & Refreshes on Navigation)
  // Trigger fetch on navigation
  private triggerCountUpdate$ = combineLatest([
    this.userId$,
    this.navigationEnd$
  ]).pipe(
    switchMap(([id, _]) => {
      return id ? this.notificationService.getNotificationCount(id) : of(0);
    })
  );

  notificationCount$ = this.notificationService.notificationCount$.pipe(startWith(0));

  // 4. Derived UI Streams
  userName$: Observable<string> = this.user$.pipe(map(u => u?.name || 'Guest User'));
  userRole$: Observable<string> = this.user$.pipe(map(u => u?.role || 'TAXPAYER'));

  userInitials$: Observable<string> = this.userName$.pipe(
    map(name => name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2))
  );

  isDarkMode = true;

  // Navigation Items
  navItems = [
    { label: 'Dashboard', route: '/portal/dashboard', icon: 'dashboard-icon', Role: ["TAXPAYER"] },
    { label: 'Profile', route: '/portal/profile', icon: 'profile-icon', Role: ["TAXPAYER", "OFFICER", "ADMINISTRATOR", "MANAGER", "COMPLIANCE", "AUDITOR"] },
    { label: 'Reg. Status', route: '/portal/status', icon: 'status-icon', Role: ["TAXPAYER"] },
    { label: 'Documents', route: '/portal/documents', icon: 'docs-icon', Role: ["TAXPAYER", "OFFICER"] },
    { label: 'Documents verification', route: '/portal/documents-verification', icon: 'shield-icon', Role: ["OFFICER"] },
    { label: 'My Filings', route: '/portal/filings', icon: 'filings-icon', badge: 3, Role: ["TAXPAYER","OFFICER"] },
    { label: 'File Taxes', route: '/portal/file-taxes', icon: 'file-icon', Role: ["TAXPAYER"] },
    { label: 'Make Payment', route: '/portal/payment', icon: 'pay-icon', Role: ["TAXPAYER"] },
    { label: 'Payment History', route: '/portal/history', icon: 'history-icon', Role: ["TAXPAYER", "OFFICER"] },
    { label: 'Notifications', route: '/portal/notifications', icon: 'bell-icon', isNotification: true, Role: ["TAXPAYER", "OFFICER", "ADMINISTRATOR", "MANAGER", "COMPLIANCE", "AUDITOR"] },
    { label: 'Revenue Dashboard', route: '/portal/reports/revenue', icon: 'chart-icon', Role: ["MANAGER", "AUDITOR"] },
    { label: 'Audit Dashboard', route: '/portal/reports/audit', icon: 'shield-icon', Role: ["AUDITOR", "ADMINISTRATOR"] },
    { label: 'Payment Analytics', route: '/portal/reports/payments', icon: 'pay-icon', Role: ["MANAGER", "AUDITOR"] },
    { label: 'Report Exports', route: '/portal/reports/download', icon: 'download-icon', Role: ["ADMINISTRATOR", "MANAGER"] },
    { label: 'Compliance Hub', route: '/portal/compliance-dashboard', icon: 'shield-icon', Role: ["COMPLIANCE"] },
    { label: 'Compliance Records', route: '/portal/compliance-records', icon: 'folder-icon', Role: ["COMPLIANCE"] },
    { label: 'Create Record', route: '/portal/create-compliance', icon: 'plus-icon', Role: ["COMPLIANCE"] },
    { label: 'Audit Cases', route: '/portal/audit-cases', icon: 'search-icon', Role: ["AUDITOR"] },
    { label: 'Create Audit', route: '/portal/create-audit', icon: 'plus-circle-icon', Role: ["AUDITOR"] },
    { label: 'Send Notification', route: '/portal/send-notification', icon: 'send-icon', Role: ["ADMINISTRATOR", "MANAGER", "COMPLIANCE","OFFICER"] }
  ];

  filteredNavItems$ = this.user$.pipe(
    map(user => {
      const role = (user?.role || 'TAXPAYER').toUpperCase();
      return this.navItems.filter(item => !item.Role || item.Role.includes(role));
    })
  );

  // toggleTheme() { this.isDarkMode = !this.isDarkMode; }


  openLogoutModal() { this.showLogoutModal = true; }

  closeLogoutModal() { this.showLogoutModal = false; }

  confirmLogout() {
    this.store.dispatch(logout());
    this.showLogoutModal = false;
  }

  toggleTheme() { this.isDarkMode = !this.isDarkMode; }
  logout() { if (confirm('Are you sure you want to log out?')) { this.store.dispatch(logout()); } }
}
