import { Routes } from '@angular/router';
import { LoginComponent } from './login-component/login-component';
import { SignupComponent } from './signup-component/signup-component';

import { DashboardComponent } from './dashboard/dashboard';
import { MyFilingsComponent } from './my-filings/my-filings';
import { LayoutComponent } from './layout/layout';
import { FileTaxesComponent } from './file-taxes/file-taxes';
import { MakePaymentComponent } from './make-payment/make-payment';
import { PaymentHistoryComponent } from './payment-history/payment-history';
import { DocumentsComponent } from './documents/documents';
import { ProfileComponent } from './profile/profile';
import { RegStatusComponent } from './reg-status/reg-status';
import { NotificationsComponent } from './notifications/notifications';
import { RevenueDashboardComponent } from './reports/revenue-dashboard/revenue-dashboard';
import { AuditDashboardComponent } from './reports/audit-dashboard/audit-dashboard';
import { PaymentMetricsComponent } from './reports/payment-metrics/payment-metrics';
import { ReportDownloadComponent } from './reports/report-download/report-download';
import { ComplianceDashboard } from './compliance-dashboard/compliance-dashboard';
import { ComplianceRecordComponent } from './compliance-record/compliance-record';
import { CreateComplianceComponent } from './create-compliance/create-compliance';
import { AuditCasesComponent } from './audit-cases/audit-cases';
import { CreateAuditComponent } from './create-audit/create-audit';
import { ViewAuditComponent } from './view-audit/view-audit';

export const routes: Routes = [
  // 1. Default route now forces the user to the login page
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 2. Public auth routes
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  // 3. Protected App Routes (Wrapped in a 'portal' path)
  {
    path: 'portal',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'status', component: RegStatusComponent },
      { path: 'filings', component: MyFilingsComponent },
      { path: 'file-taxes', component: FileTaxesComponent },
      { path: 'payment', component: MakePaymentComponent },
      { path: 'history', component: PaymentHistoryComponent },
      { path: 'notifications', component: NotificationsComponent },
      { path: 'documents', component: DocumentsComponent },
      { path: 'reports/revenue', component: RevenueDashboardComponent },
      { path: 'reports/audit', component: AuditDashboardComponent },
      { path: 'reports/payments', component: PaymentMetricsComponent },
      { path: 'reports/download', component: ReportDownloadComponent },
      { path: 'compliance-dashboard', component: ComplianceDashboard },
      { path: 'compliance-records', component: ComplianceRecordComponent },
      { path: 'create-compliance', component: CreateComplianceComponent },

      { path: 'audit-cases', component: AuditCasesComponent },
      { path: 'create-audit', component: CreateAuditComponent },
      { path: 'view-audit/:id', component: ViewAuditComponent }, // Route with ID parameter
      { path: 'view-audit', component: ViewAuditComponent }, // Fallback route
      // Default child route redirects to dashboard inside the portal
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
