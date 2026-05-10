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

   private extractErrorMessage(error: any): string {
    // 1. If the Global Interceptor caught it, it already extracted the clean string for us!
    if (error instanceof Error) {
      console.log('%c Error from Interceptor: ', 'background: #f85149; color: white;', error.message);
      return error.message;
    }

    // 2. Fallback just in case the interceptor is ever bypassed
    if (error instanceof HttpErrorResponse) {
      const backendResponse = error.error;
      if (backendResponse && backendResponse.message) {
        if (typeof backendResponse.message === 'string') return backendResponse.message;
        if (typeof backendResponse.message === 'object') return Object.values(backendResponse.message).join(' | '); 
      }
      if (backendResponse && typeof backendResponse.error === 'string') return backendResponse.error;
    }

    return error.message || 'An unexpected error occurred. Please try again.';
  }

  // 1. New Effect: Runs on app startup to re-fetch profile if token exists
  initAuth$ = createEffect(() =>
    of(null).pipe(
      map(() => {
        const token = localStorage.getItem('token');
        const email = localStorage.getItem('user_email');
        if (token && email) {
          return AuthActions.getProfile({ email });
        }
        return { type: '[Auth] No Persisted Session' };
      })
    )
  );

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
    tap(action => console.log('1. Effect received the Signup Action:', action)), 
    mergeMap((action) => {
      console.log('2. Calling AuthService.signup now...');
      return this.authService.signup(action.userData).pipe(
        tap(res => console.log('3. Backend responded:', res)),
        map((response) => AuthActions.signupSuccess({ response })),
        catchError((error: any) => {
          console.error('3. Backend Error:', error);
          return of(AuthActions.signupFailure({ error: this.extractErrorMessage(error) }));
        })
      );
    }),
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
      mergeMap((action) => {
        const profile$ = action.userId
          ? this.taxpayerService.getProfile(action.userId, action.userType)
          : this.authService.getProfile(action.email ?? '');

        return profile$.pipe(
          map((user) => AuthActions.getProfileSuccess({ user })),
          catchError((error: any) => of(AuthActions.getProfileFailure({ error: this.extractErrorMessage(error) }))),
        );
      }),
    ),
  );

  // 5. Handle Login Success -> Save Token, Fetch Profile, Redirect to Dashboard
  authSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap((action) => {
          // Store token AND email to survive refreshes
          localStorage.setItem('token', action.response.token);
          const email = action.email ?? action.response.user?.email;
          
          if (email) {
            localStorage.setItem('user_email', email);
            this.store.dispatch(AuthActions.getProfile({ email }));
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
          console.log(action.response);
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
          // Clear everything on logout
          localStorage.removeItem('token');
          localStorage.removeItem('user_email');
          this.router.navigate(['/login']);
        }),
      ),
    { dispatch: false },
  );
}