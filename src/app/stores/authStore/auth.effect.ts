import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { Store } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';

import * as AuthActions from './auth.action';
import { AuthService } from '../../core/services/auth';
import { TaxpayerService } from '../../service/taxpayer-service';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private taxpayerService = inject(TaxpayerService); // Injected new service
  private router = inject(Router);
  private store = inject(Store);

  // --- Helper function to dynamically extract Spring Boot error messages ---
  // --- Helper function to dynamically extract Spring Boot error messages ---
  private extractErrorMessage(error: any): string {
    let finalMessage = 'An unexpected error occurred. Please try again.';

    if (error instanceof HttpErrorResponse) {
      const backendResponse = error.error;

      if (backendResponse && backendResponse.message) {
        if (typeof backendResponse.message === 'string') {
          finalMessage = backendResponse.message;
        } else if (typeof backendResponse.message === 'object') {
          finalMessage = Object.values(backendResponse.message).join(' | '); 
        }
      } else if (backendResponse && typeof backendResponse.error === 'string') {
          finalMessage = backendResponse.error;
      }
    }

    // NEW: Log the beautifully extracted message directly to the console!
    console.log('%c Extracted Backend Error: ', 'background: #f85149; color: white; border-radius: 3px;', finalMessage);

    return finalMessage;
  }
  
  // 1. Handle Login API Call
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap((action) =>
        this.authService.login(action.credentials).pipe(
          map((response) => AuthActions.loginSuccess({ response, email: action.credentials.email })),
          // Use the dynamic error extractor!
          catchError((error: any) => of(AuthActions.loginFailure({ error: this.extractErrorMessage(error) }))),
        ),
      ),
    ),
  );

  // 2. Handle Signup API Call
  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signup),
      mergeMap((action) =>
        this.authService.signup(action.userData).pipe(
          map((response) => AuthActions.signupSuccess({ response })),
          // Use the dynamic error extractor!
          catchError((error: any) => of(AuthActions.signupFailure({ error: this.extractErrorMessage(error) }))),
        ),
      ),
    ),
  );

  // 3. Handle Update Profile API Call
  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.updateProfile),
      mergeMap((action) =>
        this.authService.updateProfile(action.userData).pipe(
          map((user) => AuthActions.updateProfileSuccess({ user })),
          catchError((error: any) => of(AuthActions.updateProfileFailure({ error: this.extractErrorMessage(error) }))),
        ),
      ),
    ),
  );

  // 4. Handle Get Profile API Call (Routing through TaxpayerService)
  getProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.getProfile),
      mergeMap((action) =>
        this.taxpayerService.getProfile(action.userId, action.userType).pipe(
          map((user) => AuthActions.getProfileSuccess({ user })),
          catchError((error: any) => of(AuthActions.getProfileFailure({ error: this.extractErrorMessage(error) }))),
        ),
      ),
    ),
  );

  // 5. Handle Login Success -> Save Token, Fetch Profile, Redirect to Dashboard
  authSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap((action) => {
          localStorage.setItem('token', action.response.token);
          
          const userId = action.response.user?.id;
          const userRole = action.response.user?.role || 'TAXPAYER'; 

          // Trigger the profile fetch using the new ID and Type format
          if (userId) {
            this.store.dispatch(AuthActions.getProfile({ userId: userId, userType: userRole }));
          }
          
          this.router.navigate(['/portal']);
        }),
      ),
    { dispatch: false },
  );

  // 6. Handle Signup Success -> Redirect to Login Page
  signupSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.signupSuccess),
        tap((action) => {
          console.log('Signup successful! Response:', action.response);
          this.router.navigate(['/login']);
        }),
      ),
    { dispatch: false },
  );

  // 7. Handle Logout -> Clear Token, Redirect to Login
  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        }),
      ),
    { dispatch: false },
  );
}