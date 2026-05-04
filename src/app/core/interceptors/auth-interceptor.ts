import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  // Grab the raw token string directly from local storage
  const token = localStorage.getItem('token');

  let authReq = req;

  // If the token exists, attach it to the Authorization header
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
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
