import { createFeature } from '@ngrx/store';
import { authReducer } from './auth.reducer';

export const authFeature = createFeature({
  name: 'auth',
  reducer: authReducer,
});

// NgRx automatically creates these selectors for you based on the interface!
export const {
  name, // The feature name ('auth')
  reducer, // The reducer
  selectAuthState, // Selects the whole state
  selectUser, // Selects just the user object
  selectIsAuthenticated, // Selects the boolean
  selectIsLoading, 
  selectError
} = authFeature;