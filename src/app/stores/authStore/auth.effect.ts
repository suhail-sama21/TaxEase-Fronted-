import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as AuthActions from './auth.action';
import { AuthService } from '../../core/services/auth';
import { Store } from '@ngrx/store';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);
  private store = inject(Store);

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
          catchError((error: any) => of(AuthActions.loginFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  signup$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.signup),
      mergeMap((action) =>
        this.authService.signup(action.userData).pipe(
          map((response) => {
            return AuthActions.signupSuccess({ response });
          }),
          catchError((error: any) => of(AuthActions.signupFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  updateProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.updateProfile),
      mergeMap((action) =>
        this.authService.updateProfile(action.userData).pipe(
          map((user) => AuthActions.updateProfileSuccess({ user })),
          catchError((error: any) => of(AuthActions.updateProfileFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  getProfile$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.getProfile),
      mergeMap((action) =>
        this.authService.getProfile(action.email).pipe(
          map((user) => AuthActions.getProfileSuccess({ user })),
          catchError((error: any) => of(AuthActions.getProfileFailure({ error: error.message }))),
        ),
      ),
    ),
  );

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