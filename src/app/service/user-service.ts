import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  address: string;
  contactInfo: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}
  apiURL = 'http://localhost:8082/api/taxpayers';

  getUser(sub: string): Observable<User> {
    return this.http.get<User>(this.apiURL + '/username/' + sub);
  }
}
