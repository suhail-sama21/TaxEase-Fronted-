import { Routes } from '@angular/router';
import { LoginComponent } from './login-component/login-component';
import { SignupComponent } from './signup-component/signup-component';
import { LayoutComponent } from './layout/layout';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  // 1. Default route
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // 2. Public auth routes (Eagerly loaded for instant access)
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },       

  // 3. Protected App Routes (Lazy Loaded)
  {
    path: 'portal',
    canActivate: [authGuard],
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

      { 
        path: 'dashboard', 
        loadComponent: () => import('./dashboard/dashboard').then(m => m.DashboardComponent) ,
        data: { roles: ["TAXPAYER"] }
      },
      { 
        path: 'profile', 
        loadComponent: () => import('./profile/profile').then(m => m.ProfileComponent) ,
        data: { roles: ["TAXPAYER", "OFFICER", "ADMINISTRATOR", "MANAGER", "COMPLIANCE", "AUDITOR"] }
      },
      { 
        path: 'status/:taxpayerId', 
        loadComponent: () => import('./reg-status/reg-status').then(m => m.RegStatusComponent) ,
        data: { roles: ["TAXPAYER", "OFFICER"] }
      },
      { 
        path: 'status', 
        loadComponent: () => import('./reg-status/reg-status').then(m => m.RegStatusComponent) ,
        data: { roles: ["TAXPAYER", "OFFICER"] }
      },
      { 
        path: 'documents-verification', 
        loadComponent: () => import('./documents-verification/documents-verification').then(m => m.DocumentsVerificationComponent) ,
        data: { roles: ["OFFICER"] }
      },
      { 
        path: 'filings', 
        loadComponent: () => import('./my-filings/my-filings').then(m => m.MyFilingsComponent) 
      , data: { roles: ["TAXPAYER", "OFFICER"] }
      },
      { 
        path: 'file-taxes', 
        loadComponent: () => import('./file-taxes/file-taxes').then(m => m.FileTaxesComponent) ,
        data: { roles: ["TAXPAYER"] }
      },
      { 
        path: 'payment', 
        loadComponent: () => import('./make-payment/make-payment').then(m => m.MakePaymentComponent) ,
        data: { roles: ["TAXPAYER"] }
      },
      { 
        path: 'history', 
        loadComponent: () => import('./payment-history/payment-history').then(m => m.PaymentHistoryComponent) ,
        data: { roles: ["TAXPAYER", "OFFICER"] }
      },
      { 
        path: 'receipt/:id', 
        loadComponent: () => import('./payment-receipt/payment-receipt').then(m => m.PaymentReceiptComponent) ,
        data: { roles: ["TAXPAYER", "OFFICER"] }
      },
      { 
        path: 'notifications', 
        loadComponent: () => import('./notifications/notifications').then(m => m.NotificationsComponent) ,
        data: { roles: ["TAXPAYER", "OFFICER", "ADMINISTRATOR", "MANAGER", "COMPLIANCE", "AUDITOR"] }
      },
      { 
        path: 'documents', 
        loadComponent: () => import('./documents/documents').then(m => m.DocumentsComponent) ,
        data: { roles: ["TAXPAYER", "OFFICER"] }
      },

      // Reports Section
      { 
        path: 'reports/revenue', 
        loadComponent: () => import('./reports/revenue-dashboard/revenue-dashboard').then(m => m.RevenueDashboardComponent) ,
        data: { roles: ["MANAGER", "AUDITOR", "ADMINISTRATOR"] }
      },
      { 
        path: 'reports/audit', 
        loadComponent: () => import('./reports/audit-dashboard/audit-dashboard').then(m => m.AuditDashboardComponent) 
      , data: { roles: ["AUDITOR", "ADMINISTRATOR"] }
      },
      { 
        path: 'reports/payments', 
        loadComponent: () => import('./reports/payment-metrics/payment-metrics').then(m => m.PaymentMetricsComponent) ,
        data: { roles: ["MANAGER", "AUDITOR"] }

      },
      { 
        path: 'reports/download', 
        loadComponent: () => import('./reports/report-download/report-download').then(m => m.ReportDownloadComponent) ,
        data: { roles: ["ADMINISTRATOR", "MANAGER"] }
      },

      // Compliance Section
      { 
        path: 'compliance-dashboard', 
        loadComponent: () => import('./compliance-dashboard/compliance-dashboard').then(m => m.ComplianceDashboard) 
        ,data: { roles: ["COMPLIANCE"] }
      },
      { 
        path: 'compliance-records', 
        loadComponent: () => import('./compliance-record/compliance-record').then(m => m.ComplianceRecordComponent) 
        ,data: { roles: ["COMPLIANCE"] }
      },
      { 
        path: 'create-compliance', 
        loadComponent: () => import('./create-compliance/create-compliance').then(m => m.CreateComplianceComponent) ,
        data: { roles: ["COMPLIANCE"] }
      },

      // Audit Section
      { 
        path: 'audit-cases', 
        loadComponent: () => import('./audit-cases/audit-cases').then(m => m.AuditCasesComponent) ,
        data: { roles: ["AUDITOR"] }
      },
      { 
        path: 'create-audit', 
        loadComponent: () => import('./create-audit/create-audit').then(m => m.CreateAuditComponent) ,
        data: { roles: ["AUDITOR"] }
      },
      { 
        path: 'view-audit/:id', 
        loadComponent: () => import('./view-audit/view-audit').then(m => m.ViewAuditComponent) ,
        data: { roles: ["AUDITOR", "ADMINISTRATOR"] }
      }
      ,
       { path: 'send-notification', 
        loadComponent: () => import('./send-notification/send-notification').then(m => m.SendNotificationComponent) ,
        data: { roles: ["ADMINISTRATOR", "MANAGER", "COMPLIANCE"] }},
    ],
  },
];