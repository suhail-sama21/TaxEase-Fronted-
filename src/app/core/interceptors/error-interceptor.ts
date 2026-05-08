import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast';
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let extractedMessage = 'An unexpected error occurred. Please try again.';

      // Extract the exact Spring Boot error message
      if (error.error) {
        if (typeof error.error.message === 'string') {
          extractedMessage = error.error.message;
        } else if (typeof error.error.message === 'object') {
          extractedMessage = Object.values(error.error.message).join(' | ');
        } else if (typeof error.error.error === 'string') {
          extractedMessage = error.error.error;
        }
      }

      // 1. Show the error globally on the screen via the Toast Service
      toastService.showError(extractedMessage);

      // 2. Pass the error along so your local components/Effects can still stop loading spinners
      return throwError(() => new Error(extractedMessage));
    })
  );
};