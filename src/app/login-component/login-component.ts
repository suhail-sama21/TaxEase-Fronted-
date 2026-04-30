import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
//
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login-component.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  isLoading = false;

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const payload = this.loginForm.value;
    
    // Simulate API call to backend
    console.log('Sending to AuthController:', payload);
    setTimeout(() => {
      this.isLoading = false;
      this.router.navigate(['/portal/dashboard']);
    }, 1000);
  }

  quickLogin(role: string) {
    const emails: Record<string, string> = {
      taxpayer: 'john.doe@example.com',
      admin: 'admin@taxease.gov',
      auditor: 'auditor@taxease.gov'
    };
    
    this.loginForm.patchValue({
      email: emails[role],
      password: 'demoPassword123'
    });
    this.onSubmit();
  }
}