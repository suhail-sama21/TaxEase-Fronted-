import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectError, selectIsLoading } from '../stores/authStore/auth.features';

import * as AuthActions from '../stores/authStore/auth.action';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './signup-component.html'
})
export class SignupComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);

  signupForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    address: ['', Validators.required],
    contactInfo: [''], 
    dob: ['', Validators.required], // Added Date of Birth
    panNumber: ['', [Validators.required, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i)]], // Added PAN with regex validation
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', Validators.required],
    role: ['TAXPAYER', Validators.required]
  }, { validators: this.passwordMatchValidator });

  isLoading$ = this.store.select(selectIsLoading);
  error$ = this.store.select(selectError);

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    const { confirmPassword, ...registerPayload } = this.signupForm.value;
    
    // Ensure PAN is uppercase before sending payload
    if (registerPayload.panNumber) {
      registerPayload.panNumber = registerPayload.panNumber.toUpperCase();
    }
    console.log('Register Payload:', registerPayload); // Debug log to check payload structure
    this.store.dispatch(AuthActions.signup({ userData: registerPayload }));
  }
}