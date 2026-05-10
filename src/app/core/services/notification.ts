import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface AppNotification {
  id: number;
  title: string;
  desc: string;
  time: string;
  type: string;
  icon: string;
  read: boolean;
}
export interface SendNotificationRequest {
  message: string;
  category: string;
}


@Injectable({ providedIn: 'root' })
export class NotificationService {
  private http = inject(HttpClient);
  // Using 8088 as seen in your Postman screenshot!
  private apiUrl = 'http://localhost:8088/api/notifications';

  getNotifications(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }

  markAsRead(notificationId: number, userId: number): Observable<any> {
    // FIX: Added { responseType: 'text' } so Angular doesn't crash on plain text responses
    return this.http.put(`${this.apiUrl}/${notificationId}/read?userId=${userId}`, {}, { responseType: 'text' });
  }
  sendDirectNotification(userId: number, payload: SendNotificationRequest) {
    // Add { responseType: 'text' } here
    return this.http.post(`${this.apiUrl}/user/${userId}`, payload, { responseType: 'text' });
  }

  sendBroadcastNotification(payload: SendNotificationRequest) {
    // Add { responseType: 'text' } here
    return this.http.post(`${this.apiUrl}`, payload, { responseType: 'text' });
  }
}
// Add this interface at the top of your file

// Inside your NotificationService class, add these two methods:

  /**
   * Send a direct notification to a specific user
   */
  