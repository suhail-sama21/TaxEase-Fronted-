import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private readonly API_URL = 'http://localhost:8088/api/documents';

  constructor(private http: HttpClient) {}

  // POST /api/documents/upload
  uploadDocument(dto: { filingId: number, fileUrl: string }): Observable<any> {
    return this.http.post(`${this.API_URL}/upload`, dto);
  }

  // GET /api/documents/filing/{filingId}
  getDocuments(filingId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.API_URL}/filing/${filingId}`);
  }
}
