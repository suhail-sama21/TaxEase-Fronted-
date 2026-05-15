import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CreateAuditRequest,
  AuditResponse,
  AuditDashboardResponse,
  CloseAuditRequest,
} from '../../models/audit.model';

@Injectable({
  providedIn: 'root',
})
export class AuditService {
  // Ensure this matches your Spring Boot controller mapping!
  private apiUrl = 'http://localhost:8088/api/audit';

  constructor(private http: HttpClient) {}

  createAudit(data: CreateAuditRequest): Observable<AuditResponse> {
    return this.http.post<AuditResponse>(this.apiUrl, data);
  }

  getDashboardSummary(): Observable<AuditDashboardResponse> {
    return this.http.get<AuditDashboardResponse>(`${this.apiUrl}/dashboard`);
  }

  getAllAudits(): Observable<AuditResponse[]> {
    return this.http.get<AuditResponse[]>(this.apiUrl);
  } // <-- This closing brace was missing!

  getAuditById(id: number): Observable<AuditResponse> {
    return this.http.get<AuditResponse>(`${this.apiUrl}/${id}`);
  }

  closeAudit(id: number, data: CloseAuditRequest): Observable<AuditResponse> {
    return this.http.put<AuditResponse>(`${this.apiUrl}/${id}/close`, data);
  }
}
