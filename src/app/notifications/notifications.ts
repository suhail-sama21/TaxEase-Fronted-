import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { filter, takeUntil, switchMap } from 'rxjs/operators';
import { AppNotification, NotificationService } from '../core/services/notification';
import { selectUser } from '../stores/authStore/auth.features';

// Import your Store Selector and the new Service

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.html'
})
export class NotificationsComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private notificationService = inject(NotificationService);
  private destroy$ = new Subject<void>(); // Used to clean up subscriptions

  notifications: AppNotification[] = [];
  currentUserId!: number;

  ngOnInit() {
    // 1. Subscribe to the NgRx Store to get the current user
    this.store.select(selectUser).pipe(
      takeUntil(this.destroy$),
      filter((user): user is any => !!user && !!user.id) // Ensure user and ID exist
    ).subscribe(user => {
      this.currentUserId = user.id;
      this.loadNotifications(); // 2. Fetch notifications once we have the ID
    });
  }

  loadNotifications() {
    this.notificationService.getNotifications(this.currentUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.notifications = data;
        },
        error: (err) => console.error('Error fetching notifications:', err)
      });
  }

  markAsRead(notif: AppNotification) {
    // If already read, do nothing
    if (notif.read) return;

    // Optimistic UI update: instantly change it to read on the frontend
    notif.read = true;

    // Call the backend endpoint
    this.notificationService.markAsRead(notif.id, this.currentUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: (err) => {
          console.error('Failed to mark as read:', err);
          notif.read = false; // Revert the UI change if the API fails
        }
      });
  }

  markAllAsRead() {
    // Find all notifications that are currently unread
    const unreadNotifs = this.notifications.filter(n => !n.read);
    
    // Loop through and call the endpoint for each one
    unreadNotifs.forEach(notif => {
      this.markAsRead(notif);
    });
  }

  ngOnDestroy() {
    // Prevent memory leaks when the user navigates away from this page
    this.destroy$.next();
    this.destroy$.complete();
  }
}