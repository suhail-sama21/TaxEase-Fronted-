import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TaxFilingService {
  private readonly API_URL = 'http://localhost:8088/api/filings';

  constructor(private http: HttpClient) {}

  // POST /api/filings/submit
  submitFiling(dto: any): Observable<any> {
    return this.http.post(`${this.API_URL}/submit`, dto);
  }

  // GET /api/filings/taxpayer/{taxpayerId}
  getHistory(taxpayerId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/taxpayer/${taxpayerId}`);
  }

  // PUT /api/filings/{filingId}/status?status=...
  updateStatus(filingId: number, status: string, officerId?: number): Observable<any> {
    let params = new HttpParams().set('status', status);
    if (officerId) {
      params = params.set('officerId', officerId.toString());
    }
    // Body is empty {} because status is passed as a RequestParam
    return this.http.put(`${this.API_URL}/${filingId}/status`, {}, { params });
  }

  // GET /api/filings/{filingId}
  getFilingById(filingId: number): Observable<any> {
    return this.http.get(`${this.API_URL}/${filingId}`);
  }
}
