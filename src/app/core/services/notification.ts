import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable , of, BehaviorSubject, tap} from 'rxjs';
import { environment } from '../../environment/environment';

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
  private apiUrl = environment.apiUrl + '/notifications';

  private notificationCountSubject = new BehaviorSubject<number>(0);
  public notificationCount$ = this.notificationCountSubject.asObservable();

  getNotifications(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }
  getNotificationCount(userId: any): Observable<number> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`).pipe(
      map( notifications => {
        const count = notifications ? notifications.filter(n => n.status === 'UNREAD').length : 0;
        this.notificationCountSubject.next(count);
        return count;
      })
    );
  }

  markAsRead(notificationId: number, userId: number): Observable<any> {
    // FIX: Added { responseType: 'text' } so Angular doesn't crash on plain text responses
    return this.http.put(`${this.apiUrl}/${notificationId}/read?userId=${userId}`, {}, { responseType: 'text' }).pipe(
      tap(() => {
        // Decrement the unread count since we marked one as read
        const current = this.notificationCountSubject.value;
        if (current > 0) {
          this.notificationCountSubject.next(current - 1);
        }
      })
    );
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