import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUser } from '../stores/authStore/auth.features';
import { map } from 'rxjs';
// Import your logout action
import { logout } from '../stores/authStore/auth.action'; 

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, AsyncPipe],
  templateUrl: './layout.html',
})
export class LayoutComponent implements OnInit {
  private store = inject(Store);

  userName = 'John Doe';
  userInitials = 'JD';
  userRole = 'Taxpayer';
  notificationCount = 2;
  isDarkMode = true;
  userData: any;

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
  }

  // Add the logout method
  logout() {
    if (confirm('Are you sure you want to log out?')) {
      this.store.dispatch(logout());
    }
  }

  ngOnInit(): void {
    this.store.select(selectUser).subscribe(user => {
      if (user) {
        this.userData = user;
        this.assignData();
      }
    });
  }

  assignData() {
    if (this.userData) {
      this.userName = this.userData.name || this.userName;
      this.userRole = this.userData.role || this.userRole;
      this.userInitials = this.userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
    }
  }

  navItems = [
    { label: 'Dashboard', route: '/portal/dashboard', icon: 'dashboard-icon', Role: ["TAXPAYER", "OFFICER", "ADMINISTRATOR", "MANAGER", "COMPLIANCE", "AUDITOR"] },
    { label: 'Profile', route: '/portal/profile', icon: 'profile-icon', Role: ["TAXPAYER", "OFFICER", "ADMINISTRATOR", "MANAGER", "COMPLIANCE", "AUDITOR"] },
    { label: 'Reg. Status', route: '/portal/status', icon: 'status-icon', Role: ["TAXPAYER","OFFICER"] },
    { label: 'Documents', route: '/portal/documents', icon: 'docs-icon', Role: ["TAXPAYER", "OFFICER"] },
    { label: 'My Filings', route: '/portal/filings', icon: 'filings-icon', badge: 3, Role: ["TAXPAYER","OFFICER"] },
    { label: 'File Taxes', route: '/portal/file-taxes', icon: 'file-icon', Role: ["TAXPAYER"] },
    { label: 'Make Payment', route: '/portal/payment', icon: 'pay-icon', Role: ["TAXPAYER"] },
    { label: 'Payment History', route: '/portal/history', icon: 'history-icon', Role: ["TAXPAYER", "OFFICER"] },
    { label: 'Notifications', route: '/portal/notifications', icon: 'bell-icon', badge: 2, Role: ["TAXPAYER", "OFFICER", "ADMINISTRATOR", "MANAGER", "COMPLIANCE", "AUDITOR"] },
    { label: 'Revenue Dashboard', route: '/portal/reports/revenue', icon: 'chart-icon', Role: ["MANAGER", "AUDITOR"] },
    { label: 'Audit Dashboard', route: '/portal/reports/audit', icon: 'shield-icon', Role: ["AUDITOR", "ADMINISTRATOR"] },
    { label: 'Payment Analytics', route: '/portal/reports/payments', icon: 'pay-icon', Role: ["MANAGER", "AUDITOR"] },
    { label: 'Report Exports', route: '/portal/reports/download', icon: 'download-icon', Role: ["ADMINISTRATOR", "MANAGER"] },
    { label: 'Compliance Hub', route: '/portal/compliance-dashboard', icon: 'shield-icon', Role: ["COMPLIANCE"] },
    { label: 'Compliance Records', route: '/portal/compliance-records', icon: 'folder-icon', Role: ["COMPLIANCE"] },
    { label: 'Create Record', route: '/portal/create-compliance', icon: 'plus-icon', Role: ["COMPLIANCE"] },
    { label: 'Audit Cases', route: '/portal/audit-cases', icon: 'search-icon', Role: ["AUDITOR"] },
    { label: 'Create Audit', route: '/portal/create-audit', icon: 'plus-circle-icon', Role: ["AUDITOR"] },
  ];

  filteredNavItems$ = this.store.select(selectUser).pipe(
    map(user => {
      const role = (user?.role || 'TAXPAYER').toUpperCase();
      return this.navItems.filter(item => 
        !item.Role || item.Role.includes(role)
      );
    })
  );
}