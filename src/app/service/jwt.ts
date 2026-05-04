import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

interface jwt{
  sub: string,
  role: string
}
@Injectable({
  providedIn: 'root',
})
export class Jwt {

  getPayload(): jwt | null{

    let token: string | null = localStorage.getItem('token')
    if (token){
      if (token) {
        let payload = jwtDecode<jwt>(token)
        console.log(payload);
        return payload;
      }
      return null;
    }
    else{
      return null;
    }
  }
}
