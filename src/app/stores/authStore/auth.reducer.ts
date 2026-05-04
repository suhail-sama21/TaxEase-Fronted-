import { createReducer, on } from '@ngrx/store';

import * as AuthActions from './auth.action';
import { AuthState } from '../../interfaces/auth.interface';

export const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
};

export const authReducer = createReducer(
  initialState,
  
  on(AuthActions.login, AuthActions.signup, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(AuthActions.loginSuccess, AuthActions.signupSuccess, (state, { response }) => ({
    ...state,
    user: response.user,
    isAuthenticated: true,
    isLoading: false,
    error: null
  })),

  on(AuthActions.loginFailure, AuthActions.signupFailure, (state, { error }) => ({
    ...state,
    error: error,
    isLoading: false
  })),

  on(AuthActions.logout, () => initialState)
);