import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectError, selectIsLoading } from '../stores/authStore/auth.features';

// Import your NgRx Actions and Selectors
import * as AuthActions from '../stores/authStore/auth.action';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup-component.html'
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store); // Inject the NgRx Store

  // CHANGED: Renamed from 'registerForm' to 'signupForm' to match the HTML!
  signupForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    address: ['', Validators.required],
    contactInfo: [''], 
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
    role: ['TAXPAYER', Validators.required]
  }, { validators: this.passwordMatchValidator });

  // Tap into the NgRx Store state as Observables
  isLoading$ = this.store.select(selectIsLoading);
  error$ = this.store.select(selectError);

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    // CHANGED: Update all references to 'signupForm'
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    // Strip confirmPassword before sending to the server
    const { confirmPassword, ...registerPayload } = this.signupForm.value;
    
    // Dispatch the Signup Action!
    this.store.dispatch(AuthActions.signup({ userData: registerPayload }));
  }
}