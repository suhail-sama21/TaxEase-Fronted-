import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, switchMap } from 'rxjs';
import { Jwt } from './jwt';
import { UserService } from './user-service';
import { taxpayerDocument, User } from '../dto/taxpayer-profile';
import { environment } from '../environment/environment';
import { Store } from '@ngrx/store';
import { selectUser } from '../stores/authStore/auth.features';

@Injectable({
  providedIn: 'root',
})
export class TaxpayerService {

  constructor(
    private http: HttpClient,
    private jwtService: Jwt,
    private userService: UserService,
    private store: Store
  ) {}

  getProfile(userId: any, userType: any): Observable<User | null> {
    const payload = this.jwtService.getPayload();

    if (payload && payload.sub) {
      console.log('Fetching user details for:', payload.sub);
      return this.userService.getUser(payload.sub);
    }
    return of(null);
  }

  updatePassword(id: number, passwordData: { oldPassword: string; newPassword: string }): Observable<any> {
    return this.userService.updatePassword(id, passwordData);
  }

  getDocuments(): Observable<taxpayerDocument[]> {
    return this.store.select(selectUser).pipe(
      switchMap(user => {
        if (user) {
          console.log('Fetching documents for user ID:', user.id);
          return this.http.get<taxpayerDocument[]>(`${environment.apiUrl}/taxpayers/user/${user.id}/documents`);
        } else {
          return of([]);
        }
      })
    );
  }

  uploadDocument(docType: string, fileUri: string): Observable<any> {
    return this.store.select(selectUser).pipe(
      switchMap(user => {
        if (user) {
          return this.http.post(`${environment.apiUrl}/taxpayers/user/${user.id}/documents/upload`, {
            docType,
            fileUri
          });
        }
        return of(null);
      })
    );
  }

  updateDocument(documentId: number, docType: string, fileUri: string): Observable<any> {
    return this.store.select(selectUser).pipe(
      switchMap(user => {
        if (user) {
          return this.http.put(`${environment.apiUrl}/taxpayers/user/${user.id}/documents/${documentId}`, {
            docType,
            fileUri
          });
        }
        return of(null);
      })
    );
  }

  verifyDocument(documentId: number, status: string): Observable<any> {
    return this.store.select(selectUser).pipe(
      switchMap(user => {
        if (user) {
          return this.http.patch(`${environment.apiUrl}/taxpayers/user/${user.id}/documents/${documentId}/verify`, {
            status
          });
        }
        return of(null);
      })
    );
  }

  deleteDocument(documentId: number): Observable<any> {
    return this.store.select(selectUser).pipe(
      switchMap(user => {
        if (user) {
          return this.http.delete(`${environment.apiUrl}/taxpayers/user/${user.id}/documents/${documentId}`);
        }
        return of(null);
      })
    );
  }

  updateProfile(profileData: { name: string; phone: string; address: string; panNumber: string; dob: string }): Observable<any> {
    return this.store.select(selectUser).pipe(
      switchMap(user => {
        if (user) {
          return this.http.put(`${environment.apiUrl}/taxpayers/user/${user.id}/profile`, profileData);
        }
        return of(null);
      })
    );
  }
}