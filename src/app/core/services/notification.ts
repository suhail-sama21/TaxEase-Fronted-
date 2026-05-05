import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interface matching the properties used in your HTML
export interface AppNotification {
  id: number;
  title: string;
  desc: string; // The description/message
  time: string;
  type: string;
  icon: string;
  read: boolean;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8088/api/notifications';

  // Fetch all notifications for a specific user
  getNotifications(userId: number): Observable<AppNotification[]> {
    return this.http.get<AppNotification[]>(`${this.apiUrl}/user/${userId}`);
  }

  // Mark a specific notification as read
  markAsRead(notificationId: number, userId: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${notificationId}/read?userId=${userId}`, {});
  }
}