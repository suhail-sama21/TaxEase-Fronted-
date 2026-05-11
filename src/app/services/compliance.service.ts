import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// Import ALL your interfaces
import {
  ComplianceDashboardResponse,
  CreateComplianceRequest,
  ComplianceResponse,
  UpdateComplianceRequest,
} from '../models/compliance.model';

@Injectable({
  providedIn: 'root',
})
export class ComplianceService {
  private apiUrl = 'http://localhost:8088/api/compliance';

  constructor(private http: HttpClient) {}

  getDashboardSummary(): Observable<ComplianceDashboardResponse> {
    console.log('hii');
    return this.http.get<ComplianceDashboardResponse>(`${this.apiUrl}/dashboard`);
  }

  createCompliance(data: CreateComplianceRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

  getAllCompliance(): Observable<ComplianceResponse[]> {
    console.log('Fetching all compliance records...');
    return this.http.get<ComplianceResponse[]>(this.apiUrl);
  }

  updateCompliance(id: number, data: UpdateComplianceRequest): Observable<ComplianceResponse> {
    return this.http.put<ComplianceResponse>(`${this.apiUrl}/${id}`, data);
  }
}
