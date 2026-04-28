import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignupComponent } from "./signup-component/signup-component";
import { LoginComponent } from "./login-component/login-component";
import { Audit } from './audit/audit';
import { ComplianceDashboard } from './compliance-dashboard/compliance-dashboard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'TaxEase';

}
