import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

import * as AuthActions from './auth.action';
import { AuthService } from '../../core/services/auth';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap((action) =>
        this.authService.login(action.credentials).pipe(
          map((response) => AuthActions.loginSuccess({ response })),
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

  authSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap((action) => {
          localStorage.setItem('token', action.response.token);
          //   console.log(action.response);
          this.router.navigate(['/portal']);
        }),
      ),
    { dispatch: false },
  );

  signupSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType( AuthActions.signupSuccess),
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
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        }),
      ),
    { dispatch: false },
  );
}
