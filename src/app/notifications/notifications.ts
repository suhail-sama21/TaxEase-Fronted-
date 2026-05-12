import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable, of, Subject, BehaviorSubject, combineLatest } from 'rxjs';
import { filter, takeUntil, map, switchMap, tap } from 'rxjs/operators';
import { AppNotification, NotificationService } from '../core/services/notification';
import { selectUser } from '../stores/authStore/auth.features';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './notifications.html'
})
export class NotificationsComponent implements OnInit, OnDestroy {
  private store = inject(Store);
  private notificationService = inject(NotificationService);
  private destroy$ = new Subject<void>();
  
  // Local list to allow for "Mark All as Read" logic and immediate UI updates
  private _notifications = new BehaviorSubject<any[]>([]);
  notifications$ = this._notifications.asObservable();
  
  currentUserId!: number;

  ngOnInit() {
    this.store.select(selectUser).pipe(
      takeUntil(this.destroy$),
      filter((user): user is any => !!user && !!user.id),
      tap(user => this.currentUserId = user.id),
      switchMap(user => this.notificationService.getNotifications(user.id))
    ).subscribe({
      next: (backendData) => {
        const mapped = backendData.map(n => ({
          id: n.id,
          title: this.formatTitle(n.category),
          desc: n.message,
          time: this.formatDate(n.createdAt),
          type: this.getIconType(n.category),
          icon: this.getIconSymbol(n.category),
          read: n.status === 'READ'
        }));
        this._notifications.next(mapped);
      },
      error: (err) => console.error('Error fetching notifications:', err)
    });
  }

  markAsRead(notif: any) {
    if (notif.read) return;

    // 1. Optimistic UI update
    notif.read = true;

    // 2. Persist to Backend
    this.notificationService.markAsRead(notif.id, this.currentUserId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        error: (err) => {
          console.error('Failed to mark as read:', err);
          notif.read = false; // Revert on failure
        }
      });
  }

  markAllAsRead() {
    const currentList = this._notifications.getValue();
    currentList.forEach(n => {
      if (!n.read) this.markAsRead(n);
    });
  }

  // --- Helpers (Kept exactly as provided) ---
  formatTitle(category: string): string {
    if (!category) return 'System Alert';
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}