import { Routes } from '@angular/router';
import { LoginComponent } from './login-component/login-component';
import { SignupComponent } from './signup-component/signup-component';

import { DashboardComponent } from './dashboard/dashboard';
import { MyFilingsComponent } from './my-filings/my-filings'; // Add this import
import { LayoutComponent } from './layout/layout';
import { FileTaxesComponent } from './file-taxes/file-taxes';
import { MakePaymentComponent } from './make-payment/make-payment';
import { PaymentHistoryComponent } from './payment-history/payment-history';
import { DocumentsComponent } from './documents/documents';
import { ProfileComponent } from './profile/profile';
import { RegStatusComponent } from './reg-status/reg-status';
import { NotificationsComponent } from './notifications/notifications';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { 
    path: '', 
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'status', component: RegStatusComponent },
      { path: 'filings', component: MyFilingsComponent },
      { path: 'file-taxes', component: FileTaxesComponent },
      { path: 'payment', component: MakePaymentComponent }, 
      { path: 'history', component: PaymentHistoryComponent },// Add this route
      { path: 'notifications', component: NotificationsComponent },
      { path: 'documents', component: DocumentsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];