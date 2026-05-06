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
  
  on(AuthActions.login, AuthActions.signup, AuthActions.updateProfile, AuthActions.getProfile, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(AuthActions.loginSuccess, AuthActions.signupSuccess, (state, { response }) => ({
    ...state,
    user: response.user ?? state.user,
    isAuthenticated: true,
    isLoading: false,
    error: null
  })),

  on(AuthActions.getProfileSuccess, AuthActions.updateProfileSuccess, (state, { user }) => ({
    ...state,
    user,
    isLoading: false,
    error: null
  })),

  on(AuthActions.loginFailure, AuthActions.signupFailure, AuthActions.updateProfileFailure, AuthActions.getProfileFailure, (state, { error }) => ({
    ...state,
    error: error,
    isLoading: false
  })),

  on(AuthActions.logout, () => initialState)
);