import { Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
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
  private router = inject(Router);

  // 1. UI State
  showLogoutModal = false;
  isDarkMode = true;

  // 2. Core User Streams
  user$ = this.store.select(selectUser);
  userId$ = this.user$.pipe(map(u => u?.id));

  // 3. Navigation Trigger Stream
  private navigationEnd$ = this.router.events.pipe(
    filter(event => event instanceof NavigationEnd),
    startWith(null) 
  );

  // 4. Notification Logic
  // Triggers the service to fetch new data whenever the Route or User ID changes
  private triggerCountUpdate$ = combineLatest([
    this.userId$,
    this.navigationEnd$
  ]).pipe(
    switchMap(([id, _]) => {
      return id ? this.notificationService.getNotificationCount(id) : of(0);
    })
  );

  // The stream the HTML actually listens to
  notificationCount$: Observable<number> = this.notificationService.notificationCount$.pipe(startWith(0));

  // 5. Derived UI Streams
  userName$: Observable<string> = this.user$.pipe(map(u => u?.name || 'Guest User'));
  userRole$: Observable<string> = this.user$.pipe(map(u => u?.role || 'TAXPAYER'));
  userInitials$: Observable<string> = this.userName$.pipe(
    map(name => name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2))
  );

  // 6. Navigation Items Configuration
  navItems = [
    { label: 'Dashboard', route: '/portal/dashboard', Role: ["TAXPAYER"] },
    { label: 'Profile', route: '/portal/profile', Role: ["TAXPAYER", "OFFICER", "ADMINISTRATOR", "MANAGER", "COMPLIANCE", "AUDITOR"] },
    { label: 'Reg. Status', route: '/portal/status', Role: ["TAXPAYER"] },
    { label: 'Documents', route: '/portal/documents', Role: ["TAXPAYER", "OFFICER"] },
    { label: 'Documents verification', route: '/portal/documents-verification', Role: ["OFFICER"] },
    { label: 'My Filings', route: '/portal/filings', badge: 3, Role: ["TAXPAYER","OFFICER"] },
    { label: 'File Taxes', route: '/portal/file-taxes', Role: ["TAXPAYER"] },
    { label: 'Make Payment', route: '/portal/payment', Role: ["TAXPAYER"] },
    { label: 'Payment History', route: '/portal/history', Role: ["TAXPAYER", "OFFICER"] },
    { label: 'Notifications', route: '/portal/notifications', isNotification: true, Role: ["TAXPAYER", "OFFICER", "ADMINISTRATOR", "MANAGER", "COMPLIANCE", "AUDITOR"] },
    { label: 'Revenue Dashboard', route: '/portal/reports/revenue', Role: ["MANAGER", "AUDITOR"] },
    { label: 'Audit Dashboard', route: '/portal/reports/audit', Role: ["AUDITOR", "ADMINISTRATOR"] },
    { label: 'Payment Analytics', route: '/portal/reports/payments', Role: ["MANAGER", "AUDITOR"] },
    { label: 'Report Exports', route: '/portal/reports/download', Role: ["ADMINISTRATOR", "MANAGER"] },
    { label: 'Compliance Hub', route: '/portal/compliance-dashboard', Role: ["COMPLIANCE"] },
    { label: 'Compliance Records', route: '/portal/compliance-records', Role: ["COMPLIANCE"] },
    { label: 'Create Record', route: '/portal/create-compliance', Role: ["COMPLIANCE"] },
    { label: 'Audit Cases', route: '/portal/audit-cases', Role: ["AUDITOR"] },
    { label: 'Create Audit', route: '/portal/create-audit', Role: ["AUDITOR"] },
    { label: 'Send Notification', route: '/portal/send-notification', Role: ["ADMINISTRATOR", "MANAGER", "COMPLIANCE","OFFICER"] }
  ];

  filteredNavItems$ = this.user$.pipe(
    map(user => {
      const role = (user?.role || 'TAXPAYER').toUpperCase();
      return this.navItems.filter(item => !item.Role || item.Role.includes(role));
    })
  );

  constructor() {
    this.triggerCountUpdate$.subscribe();
  }

  // 7. Actions
  toggleTheme() { this.isDarkMode = !this.isDarkMode; }
  openLogoutModal() { this.showLogoutModal = true; }
  closeLogoutModal() { this.showLogoutModal = false; }
  confirmLogout() {
    this.store.dispatch(logout());
    this.showLogoutModal = false;
  }
}