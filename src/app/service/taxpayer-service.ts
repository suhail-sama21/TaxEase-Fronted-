import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, switchMap } from 'rxjs';
import { Jwt } from './jwt';
import { UserService } from './user-service';
import { User } from '../dto/taxpayer-profile';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root',
})
export class TaxpayerService {
  apiURL: string = 'http://localhost:8082/api/taxpayers';

  constructor(
    private http: HttpClient,
    private jwtService: Jwt,
    private userService: UserService,
  ) {}

  getProfile(): Observable<User | null> {
    const payload = this.jwtService.getPayload();

    if (payload && payload.sub) {
      console.log('Fetching user details for:', payload.sub);
      return this.userService.getUser(payload.sub);
    }
    return of(null);
  }
}
