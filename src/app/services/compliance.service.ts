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
  private apiUrl = 'http://localhost:8080/api/compliance';

  constructor(private http: HttpClient) {}

  //1
  getDashboardSummary(): Observable<ComplianceDashboardResponse> {
    return this.http.get<ComplianceDashboardResponse>(`${this.apiUrl}/dashboard`);
  }

  //2
  createCompliance(data: CreateComplianceRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}`, data);
  }

  // --- COMPLIANCE RECORDS ---

  // 3. Fetch all records
  getAllCompliance(): Observable<ComplianceResponse[]> {
    return this.http.get<ComplianceResponse[]>(this.apiUrl);
  }

  // 4. Update a specific record
  updateCompliance(id: number, data: UpdateComplianceRequest): Observable<ComplianceResponse> {
    return this.http.put<ComplianceResponse>(`${this.apiUrl}/${id}`, data);
  }
}
