import { Component, inject, NgZone, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService, SendNotificationRequest } from '../core/services/notification';
import { Store } from '@ngrx/store';
import { selectUser } from '../stores/authStore/auth.features';

@Component({
  selector: 'app-send-notification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './send-notification.html'
})
export class SendNotificationComponent implements OnInit {
  private store = inject(Store);
  private ngZone = inject(NgZone);
  private fb = inject(FormBuilder);
  private notificationService = inject(NotificationService);
  private cdr = inject(ChangeDetectorRef);

  notificationForm!: FormGroup;
  notificationType: 'DIRECT' | 'BROADCAST' = 'DIRECT';
  
  isLoading = false;
  statusInfo: { message: string, type: 'success' | 'error' } | null = null;
  categories = ['FILING', 'PAYMENT', 'AUDIT', 'BROADCAST','SYSTEM_UPDATE'];
  role = 'USER';

  ngOnInit() {
    this.notificationForm = this.fb.group({
      userId: ['', [Validators.required, Validators.min(1)]],
      category: ['SYSTEM', Validators.required],
      message: ['', Validators.required]
    });

    this.store.select(selectUser).subscribe(user => {
      if (user) {
        this.role = user.role;
      }
    });
  }

  // REFACTORED: All error parsing logic is now centralized here
  private extractErrorMessage(err: any): string {
    let exactError = 'Failed to send notification.';

    // 1. Interceptor check (Standard Error object)
    if (err instanceof Error && err.message !== 'An unexpected error occurred. Please try again.') {
      exactError = err.message;
    } 
    // 2. HTTP Backend Errors
    else if (err instanceof HttpErrorResponse || err.error) {
      const backendResponse = err.error;

      // If backend sent a raw string
      if (typeof backendResponse === 'string') {
        try {
          const parsed = JSON.parse(backendResponse);
          exactError = parsed.message || parsed.error || exactError;
        } catch (e) {
          exactError = backendResponse; // Plain text fallback
        }
      } 
      // Standard Angular JSON check
      else if (backendResponse?.message) {
        exactError = backendResponse.message;
      }
    }

    // 3. Final Fallback overrides for specific scenarios
    if (exactError === 'An unexpected error occurred. Please try again.' || exactError.includes('Http failure')) {
       exactError = 'User ID not found or unavailable.';
    }

    return exactError;
  }

  setNotificationType(type: 'DIRECT' | 'BROADCAST') {
    this.notificationType = type;
    this.statusInfo = null;

    const userIdControl = this.notificationForm.get('userId');
    const categoryControl = this.notificationForm.get('category');

    if (type === 'BROADCAST') {
      userIdControl?.clearValidators();
      userIdControl?.setValue('');
      categoryControl?.setValue('BROADCAST');
    } else {
      userIdControl?.setValidators([Validators.required, Validators.min(1)]);
      categoryControl?.setValue('SYSTEM');
    }
    userIdControl?.updateValueAndValidity();
  }

  sendNotification() {
    if (this.notificationForm.invalid) return;

    this.isLoading = true;
    this.statusInfo = null;

    const formValue = this.notificationForm.value;
    const payload: SendNotificationRequest = {
      message: formValue.message,
      category: formValue.category
    };

    const request$ = this.notificationType === 'DIRECT'
      ? this.notificationService.sendDirectNotification(Number(formValue.userId), payload)
      : this.notificationService.sendBroadcastNotification(payload);

    request$.subscribe({
      next: () => {
        this.ngZone.run(() => {
          this.isLoading = false;
          this.statusInfo = { message: '✓ Notification sent successfully!', type: 'success' };
          
          this.notificationForm.reset({
            userId: '',
            category: this.notificationType === 'BROADCAST' ? 'BROADCAST' : 'SYSTEM',
            message: ''
          });

          this.cdr.detectChanges();
          
          setTimeout(() => {
            this.ngZone.run(() => {
              this.statusInfo = null;
              this.cdr.detectChanges();
            });
          }, 3000);
        });
      },
      error: (err: any) => {
        this.ngZone.run(() => {
          this.isLoading = false;
          
          // REFACTORED: We now just call the helper method!
          const parsedErrorMsg = this.extractErrorMessage(err);

          this.statusInfo = { message: `⚠ ${parsedErrorMsg}`, type: 'error' };
          this.cdr.detectChanges(); 
        });
      }
    });
  }

  cancel() {
    this.notificationForm.reset({
      userId: '',
      category: this.notificationType === 'BROADCAST' ? 'BROADCAST' : 'SYSTEM',
      message: ''
    });
    this.statusInfo = null;
  }
}