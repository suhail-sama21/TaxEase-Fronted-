import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8088/api/payments'; 
  private taxFilingApiUrl = 'http://localhost:8088/api/filings'; 

  constructor(private http: HttpClient) {}
  
  getAllFilings(userId: number): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    console.log('Fetching filings for userId:', userId);

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
    
    return this.http.post(`${this.apiUrl}/pay`, paymentData, { headers }); 
  }

  getPaymentById(paymentId: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    
    return this.http.get(`${this.apiUrl}/${paymentId}`, { headers });
  }
}