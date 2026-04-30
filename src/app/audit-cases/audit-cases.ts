import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-audit-cases',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './audit-cases.html'
})
export class AuditCasesComponent {

  metrics = {
    total: 156,
    open: 42,
    inProgress: 68,
    closed: 46
  };

  auditCases = [
    { id: 'AUD-2026-042', filingId: 'FIL-2025-089', taxpayer: 'Acme Corp', type: 'Financial', priority: 'High', status: 'In Progress', statusColor: 'amber', date: '2026-03-01', assigned: 'Officer Smith' },
    { id: 'AUD-2026-041', filingId: 'FIL-2026-012', taxpayer: 'John Doe', type: 'Document', priority: 'Low', status: 'Open', statusColor: 'blue', date: '2026-03-02', assigned: 'Officer Johnson' },
    { id: 'AUD-2026-040', filingId: 'FIL-2025-104', taxpayer: 'TechFlow LLC', type: 'Risk-Based', priority: 'Medium', status: 'Escalated', statusColor: 'red', date: '2026-02-28', assigned: 'Officer Williams' },
    { id: 'AUD-2026-039', filingId: 'FIL-2025-077', taxpayer: 'Jane Smith', type: 'Compliance', priority: 'Medium', status: 'Closed', statusColor: 'green', date: '2026-02-15', assigned: 'Officer Smith' },
    { id: 'AUD-2026-038', filingId: 'FIL-2025-065', taxpayer: 'Global Ind.', type: 'Financial', priority: 'High', status: 'In Progress', statusColor: 'amber', date: '2026-02-10', assigned: 'Officer Brown' },
    { id: 'AUD-2026-037', filingId: 'FIL-2026-005', taxpayer: 'Robert Johnson', type: 'Document', priority: 'Low', status: 'Open', statusColor: 'blue', date: '2026-02-05', assigned: 'Officer Johnson' },
    { id: 'AUD-2026-036', filingId: 'FIL-2025-042', taxpayer: 'DataSystems', type: 'Financial', priority: 'High', status: 'Closed', statusColor: 'green', date: '2026-01-20', assigned: 'Officer Williams' }
  ];

  createNewAudit() {
    alert('Navigating to Create Audit form...');
    // router.navigate(['/portal/create-audit'])
  }

  viewDetails(id: string) {
    alert(`Viewing details for ${id}`);
  }

  addFinding(id: string) {
    alert(`Opening Add Finding modal for ${id}`);
  }
}
