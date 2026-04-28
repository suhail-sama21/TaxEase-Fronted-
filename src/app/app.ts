import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SignupComponent } from "./signup-component/signup-component";
import { LoginComponent } from "./login-component/login-component";
import { ComplianceRecordComponent } from './compliance-record/compliance-record';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,ComplianceRecordComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'TaxEase';

}
