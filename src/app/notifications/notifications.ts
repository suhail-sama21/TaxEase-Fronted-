import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AppNotification, NotificationService } from '../core/services/notification';
import { selectUser } from '../stores/authStore/auth.features';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.html'
})
export class NotificationsComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private notificationService = inject(NotificationService);
  private destroy$ = new Subject<void>();

  notifications: AppNotification[] = [];
  currentUserId!: number;

  ngOnInit() {
    this.store.select(selectUser).pipe(
      takeUntil(this.destroy$),
      filter((user): user is any => !!user && !!user.id)
    ).subscribe(user => {
      this.currentUserId = user.id;
      this.loadNotifications();
    });
  }

  loadNotifications() {
    this.notificationService.getNotifications(this.currentUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (backendData) => {
          // MAP the backend JSON to the format your HTML expects
          this.notifications = backendData.map(n => ({
            id: n.id,
            title: this.formatTitle(n.category), 
            desc: n.message, // Map 'message' to 'desc'
            time: this.formatDate(n.createdAt), // Map 'createdAt' to 'time'
            type: this.getIconType(n.category),
            icon: this.getIconSymbol(n.category),
            read: n.status === 'READ' // Map 'status' to boolean
          }));
        },
        error: (err) => console.error('Error fetching notifications:', err)
      });
  }

  // --- Helper Methods to generate UI styling based on Backend Category ---
  
  formatTitle(category: string): string {
    if (!category) return 'System Alert';
    // Turns "FILING" into "Filing Update"
    return category.charAt(0).toUpperCase() + category.slice(1).toLowerCase() + ' Update';
  }

  getIconType(category: string): string {
    switch (category?.toUpperCase()) {
      case 'FILING': return 'success';
      case 'PAYMENT': return 'info';
      case 'AUDIT': return 'warning';
      default: return 'system';
    }
  }

  getIconSymbol(category: string): string {
    switch (category?.toUpperCase()) {
      case 'FILING': return '✓';
      case 'PAYMENT': return '$';
      case 'AUDIT': return '⚠';
      default: return '🔔';
    }
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  // -----------------------------------------------------------------------

  markAsRead(notif: AppNotification) {
    if (notif.read) return;

    notif.read = true; // Instantly update UI

    this.notificationService.markAsRead(notif.id, this.currentUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => console.log('Successfully marked as read'),
        error: (err) => {
          console.error('Failed to mark as read:', err);
          notif.read = false; // Revert if API fails
        }
      });
  }

  markAllAsRead() {
    const unreadNotifs = this.notifications.filter(n => !n.read);
    unreadNotifs.forEach(notif => this.markAsRead(notif));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}