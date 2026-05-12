import { Component, inject, NgZone, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http'; // 1. IMPORT THIS
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
  categories = ['FILING', 'PAYMENT', 'AUDIT', 'BROADCAST'];
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

  // 2. ADD YOUR EXTRACTION LOGIC HERE
  private extractErrorMessage(error: any): string {
    if (error instanceof HttpErrorResponse) {
      const backendResponse = error.error;
      
      // If the backend sent a JSON object with a message
      if (backendResponse && backendResponse.message) {
        if (typeof backendResponse.message === 'string') return backendResponse.message;
        if (typeof backendResponse.message === 'object') return Object.values(backendResponse.message).join(' | '); 
      }
      
      // If the backend sent a plain string directly
      if (typeof backendResponse === 'string') return backendResponse;
      
      // If the backend sent an 'error' field instead of 'message'
      if (backendResponse && typeof backendResponse.error === 'string') return backendResponse.error;
    }
    return error.message || 'An unexpected error occurred.';
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
          
          let exactError = 'Failed to send notification.';

          // 1. Check if the error was intercepted and converted to a standard Error object
          if (err instanceof Error && err.message !== 'An unexpected error occurred. Please try again.') {
            exactError = err.message;
          } 
          // 2. Check if the backend sent a raw string (due to responseType: 'text')
          else if (err.error && typeof err.error === 'string') {
            try {
              // Try to parse the raw string back into JSON
              const parsed = JSON.parse(err.error);
              exactError = parsed.message || parsed.error || exactError;
            } catch (e) {
              // If it's plain text (not JSON), just use the text
              exactError = err.error;
            }
          } 
          // 3. Fallback to standard Angular error extraction
          else if (err.error?.message) {
            exactError = err.error.message;
          }

          // If the generic interceptor message still slipped through, provide a better default for this specific form
          if (exactError === 'An unexpected error occurred. Please try again.' || exactError.includes('Http failure')) {
             exactError = 'User ID not found or unavailable.';
          }

          this.statusInfo = { message: `⚠ ${exactError}`, type: 'error' };
          this.cdr.detectChanges(); // Force UI to update
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