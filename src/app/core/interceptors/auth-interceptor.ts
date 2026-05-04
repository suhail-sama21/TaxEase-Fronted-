import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
 
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  let localStorageToken = localStorage.getItem('token');
 
  let parsedToken;
  if (localStorageToken) {
    parsedToken= JSON.parse(localStorageToken);
    console.log(parsedToken)
  }
 
  let authReq = req;
 
  if (parsedToken) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${parsedToken}`,
      },
    });
  }
 
  return next(authReq).pipe(
    catchError((error) => {
      if (error.status === 401 || error.status === 403) {
        localStorage.clear();
        router.navigate(['/login']);
      }
      return throwError(() => error);
    }),
  );
};
 
 