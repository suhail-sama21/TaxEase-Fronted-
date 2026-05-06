import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environment/environment';
import { AuthResponse, User } from '../../interfaces/auth.interface';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  login(credentials: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials);
  }

  signup(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData);
  }

  updateProfile(userData: any): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/profile`, userData);
  }

  getProfile(email: string): Observable<User> {
    return this.http.get<User>(`http://localhost:8099/api/users/username/${email}`);
  }
}
