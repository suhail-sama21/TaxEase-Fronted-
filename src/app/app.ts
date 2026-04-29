import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignupComponent } from './signup-component/signup-component';
import { LoginComponent } from './login-component/login-component';
import { ComplianceRecordComponent } from './compliance-record/compliance-record';
import { CreateComplianceComponent } from './create-compliance/create-compliance';
import { CreateAuditComponent } from './create-audit/create-audit';
import { AuditCasesComponent } from './audit-cases/audit-cases';
import { ViewAuditComponent } from './view-audit/view-audit';
import { ComplianceDashboard } from './compliance-dashboard/compliance-dashboard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AuditCasesComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class AppComponent {
  title = 'TaxEase';
}
