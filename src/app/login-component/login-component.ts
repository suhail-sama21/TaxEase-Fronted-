import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { authFeature, selectError, selectIsLoading } from '../stores/authStore/auth.features';

import * as AuthActions from '../stores/authStore/auth.action';
import { catchError, tap } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login-component.html'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store); // Inject the NgRx Store instead of the Router

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  // Tap into the NgRx Store state as Observables
  isLoading$ = this.store.select(selectIsLoading);
  error$ = this.store.select(selectError);

  ngOnInit(){
  }
  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const formData = this.loginForm.value;

    console.log(formData)

    // Dispatch the Login Action!
    // The AuthEffects will catch this, call the backend, and handle the redirect automatically.
    this.store.dispatch(AuthActions.login({credentials: formData }));
  }

  quickLogin(role: string) {
    const emails: Record<string, string> = {
      taxpayer: 'john.doe@example.com',
      admin: 'admin@taxease.gov',
      auditor: 'auditor1@taxease.gov'
    };

    this.loginForm.patchValue({
      email: emails[role],
      password: 'Password123' // Assuming this is the default password for all test accounts
    });

    // Trigger the submission with the patched values
    this.onSubmit();
  }
}
