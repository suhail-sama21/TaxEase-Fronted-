import { Component, inject, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // Switched to Reactive Forms
import { NotificationService, SendNotificationRequest } from '../core/services/notification';

@Component({
  selector: 'app-send-notification',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], // Import ReactiveFormsModule here
  templateUrl: './send-notification.html'
})
export class SendNotificationComponent implements OnInit {
  private ngZone = inject(NgZone);
  private fb = inject(FormBuilder);
  private notificationService = inject(NotificationService);

  notificationForm!: FormGroup;
  notificationType: 'DIRECT' | 'BROADCAST' = 'DIRECT';
  
  isLoading = false;
  statusInfo: { message: string, type: 'success' | 'error' } | null = null;
  categories = ['FILING', 'PAYMENT', 'AUDIT', 'SYSTEM', 'BROADCAST'];

  ngOnInit() {
    // 1. Initialize the strict Reactive Form
    this.notificationForm = this.fb.group({
      userId: ['', [Validators.required, Validators.min(1)]],
      category: ['SYSTEM', Validators.required],
      message: ['', Validators.required]
    });
  }

  setNotificationType(type: 'DIRECT' | 'BROADCAST') {
    this.notificationType = type;
    this.statusInfo = null;

    const userIdControl = this.notificationForm.get('userId');
    const categoryControl = this.notificationForm.get('category');

    // 2. Dynamically add or remove requirements based on the toggle
    if (type === 'BROADCAST') {
      userIdControl?.clearValidators();
      userIdControl?.setValue('');
      categoryControl?.setValue('BROADCAST');
    } else {
      userIdControl?.setValidators([Validators.required, Validators.min(1)]);
      categoryControl?.setValue('SYSTEM');
    }
    userIdControl?.updateValueAndValidity(); // Tell Angular to re-check the form
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
          this.statusInfo = { message: '✓ Notification sent', type: 'success' };
          
          // 3. INSTANT RESET: This instantly clears the UI inputs!
          this.notificationForm.reset({
            userId: '',
            category: this.notificationType === 'BROADCAST' ? 'BROADCAST' : 'SYSTEM',
            message: ''
          });
          
          setTimeout(() => {
            this.ngZone.run(() => this.statusInfo = null);
          }, 3000);
        });
      },
      error: (err: Error) => {
        this.ngZone.run(() => {
          this.isLoading = false;
          this.statusInfo = { message: '⚠ Failed to send', type: 'error' };
        });
      }
    });
  }

  cancel() {
    // Instantly clear everything if the user clicks "Clear"
    this.notificationForm.reset({
      userId: '',
      category: this.notificationType === 'BROADCAST' ? 'BROADCAST' : 'SYSTEM',
      message: ''
    });
    this.statusInfo = null;
  }
}