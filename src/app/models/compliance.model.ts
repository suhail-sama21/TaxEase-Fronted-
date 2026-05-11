export interface ComplianceDashboardResponse {
  totalChecks: number;
  pendingReviews: number;
  nonCompliant: number;
  compliant: number;
  systemHealth: number;
}

export interface CreateComplianceRequest {
  taxpayerId: number;
  type: string;
  result: string;
  filingId?: number | null;
  paymentId?: number | null;
  notes?: string;
}

export interface ComplianceResponse {
  status: any;
  statusColor: any;
  id: number;
  taxpayerId: number;
  filingId?: number;
  paymentId?: number;
  type: string;
  result: string;
  date: string;
  notes?: string;
  createdAt: string;
}

export interface UpdateComplianceRequest {
  result: string;
  notes?: string;
}
