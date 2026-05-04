import { createAction, props } from '@ngrx/store';
import { AuthResponse } from '../../interfaces/auth.interface';


export const login = createAction('[Auth] Login', props<{ credentials: { email: string; password: string } }>());
export const loginSuccess = createAction('[Auth] Login Success', props<{ response: AuthResponse }>());
export const loginFailure = createAction('[Auth] Login Failure', props<{ error: string }>());

export const signup = createAction('[Auth] Signup', props<{ userData: any }>());
export const signupSuccess = createAction('[Auth] Signup Success', props<{ response: AuthResponse }>());
export const signupFailure = createAction('[Auth] Signup Failure', props<{ error: string }>());

export const logout = createAction('[Auth] Logout');