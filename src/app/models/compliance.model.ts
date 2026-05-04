export interface ComplianceDashboardResponse {
  totalChecks: number;
  pendingReviews: number;
  nonCompliant: number;
  compliant: number;
  systemHealth: number;
}

export interface CreateComplianceRequest {
  taxpayerId: number;
  type: string; // Matches Java's "type" property
  result: string;
  filingId?: number | null;
  paymentId?: number | null;
  notes?: string;
}

// Add these below your existing interfaces

export interface ComplianceResponse {
  status: any;
  statusColor: any;
  id: number;
  taxpayerId: number;
  filingId?: number;
  paymentId?: number;
  type: string;
  result: string; // Note: Your backend uses 'result', not 'status'
  date: string;
  notes?: string;
  createdAt: string;
}

export interface UpdateComplianceRequest {
  result: string;
  notes?: string;
}
