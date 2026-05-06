export interface CreateAuditRequest {
  officerId: number;
  scope: string;
  findings?: string;
  taxpayerId: number;
}

export interface AuditResponse {
  id: number;
  officerId: number;
  scope: string;
  findings: string;
  status: string;
  createdAt?: string;
  taxpayerId: number;
}

export interface AuditDashboardResponse {
  totalCases: number;
  open: number;
  inProgress: number;
  closed: number;
}

export interface CloseAuditRequest {
  findings: string;
}
