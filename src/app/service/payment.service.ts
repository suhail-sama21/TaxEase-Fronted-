import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  // CORRECT PORT: 8084
  private apiUrl = 'http://localhost:8088/api/payments'; 

  constructor(private http: HttpClient) {}
  private taxFilingApiUrl = 'http://localhost:8088/api/filings'; 
  // ADD THIS FUNCTION: Fetch pending filings for a user
getAllFilings(userId: number): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    // FIXED: Added { headers } to the request!
    return this.http.get<any[]>(`${this.taxFilingApiUrl}/taxpayer/${userId}`, { headers }); 
  }
  getPaymentHistory(userId: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/history/${userId}`, { headers });
  }

  makePayment(paymentData: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    // CORRECT ENDPOINT: /pay
    return this.http.post(`${this.apiUrl}/pay`, paymentData, { headers }); 
  }
}