import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';


export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  // You can even remove the inject(ToastService) line if you aren't using it at all anymore
  // const toastService = inject(ToastService); 

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let extractedMessage = 'An unexpected error occurred. Please try again.';

      if (error.error) {
        if (typeof error.error.message === 'string') {
          extractedMessage = error.error.message;
        } else if (typeof error.error.message === 'object') {
          extractedMessage = Object.values(error.error.message).join(' | ');
        } else if (typeof error.error.error === 'string') {
          extractedMessage = error.error.error;
        }
      }

      // REMOVE OR COMMENT OUT THIS LINE:
      // toastService.showError(extractedMessage);

      // Keep this line! This passes the extracted "Taxpayer not found..." string to your component
      return throwError(() => new Error(extractedMessage));
    })
  );
};