import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PaymentMetricsResponse {
  successfulTransactions: number;
  failedTransactions: number;
  totalTransactions: number;
}

// Added this interface so Angular knows what a single payment looks like
export interface PaymentResponseDto {
  id: number;
  taxpayerId: number;
  amount: number;
  status: string;
  method: string;
  date: string;
}

export interface AuditDashboardResponse {
  totalAudits: number;
  openAudits: number;
  closedAudits: number;
  nonComplianceFilings: number;
}

export interface AuditDto {
  id: number;
  officerId: number;
  scope: string;
  findings: string;
  status: string;
  createdAt: string;
}

export interface RevenueDashboardResponse {
  revenueCollected: number;
  outstandingPayments: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReportingService {
  // Make sure this matches your Gateway or Reporting Service port
  private apiUrl = 'http://localhost:8088/api/reports'; 

  constructor(private http: HttpClient) {}

  getPaymentMetrics(method?: string): Observable<PaymentMetricsResponse> {
    let params = new HttpParams();
    if (method) {
      params = params.set('method', method);
    }
    return this.http.get<PaymentMetricsResponse>(`${this.apiUrl}/payments/metrics`, { params });
  }

  // Added this method to fetch the list of all payments
  getAllPayments(): Observable<PaymentResponseDto[]> {
    return this.http.get<PaymentResponseDto[]>(`${this.apiUrl}/payments/all`);
  }

  getAuditDashboard(): Observable<AuditDashboardResponse> {
    return this.http.get<AuditDashboardResponse>(`${this.apiUrl}/audits/dashboard`);
  }

  getCompletedAudits(): Observable<AuditDto[]> {
    return this.http.get<AuditDto[]>(`${this.apiUrl}/audits/completed`);
  }

  getRevenueDashboard(period?: string, taxpayerType?: string): Observable<RevenueDashboardResponse> {
    let params = new HttpParams();
    if (period) params = params.set('period', period);
    if (taxpayerType) params = params.set('taxpayerType', taxpayerType);
    
    return this.http.get<RevenueDashboardResponse>(`${this.apiUrl}/revenue/dashboard`, { params });
  }

  downloadCustomReport(startDate: string, endDate: string, reportType: string, metrics: string[]): Observable<Blob> {
    let params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate)
      .set('reportType', reportType)
      // Spring boot expects comma separated strings for List: "Compliance,Revenue"
      .set('metrics', metrics.join(',')); 

    return this.http.get(`${this.apiUrl}/custom/download`, { 
      params: params, 
      responseType: 'blob' // MUKKIYAM: Ithu file nu Angular-ku solrom!
    });
  }

}
