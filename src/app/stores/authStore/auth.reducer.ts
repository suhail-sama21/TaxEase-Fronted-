import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.action';
import { AuthState } from '../../interfaces/auth.interface';

// Helper to check for existing session on startup
const getInitialUser = () => {
  const saved = localStorage.getItem('user_auth_data');
  return saved ? JSON.parse(saved) : null;
};

export const initialState: AuthState = {
  user: getInitialUser(),
  isAuthenticated: !!localStorage.getItem('token'),
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

  on(AuthActions.loginSuccess, (state, { response }) => {
    // Stop the spinner and mark as authenticated
    return {
      ...state,
      isAuthenticated: true,
      isLoading: false,
      error: null
    };
  }),

  on(AuthActions.getProfileSuccess, (state, { user }) => {
    // Save user details to survive refresh
    localStorage.setItem('user_auth_data', JSON.stringify(user));
    return {
      ...state,
      user,
      isLoading: false,
      error: null
    };
  }),

  on(AuthActions.loginFailure, AuthActions.signupFailure, (state, { error }) => ({
    ...state,
    error,
    isLoading: false // Stops the "Signing in..." spinner on error
  })),

  on(AuthActions.logout, () => {
    localStorage.clear();
    return {
      user: null,
      isAuthenticated: false,
      error: null,
      isLoading: false
    };
  }),
  on(AuthActions.signupSuccess, (state) => ({
  ...state,
  isLoading: false, // Turn off spinner
  error: null
}))
);