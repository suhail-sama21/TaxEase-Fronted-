import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

// NgRx Imports
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { authFeature } from './stores/authStore/auth.features';
import { AuthEffects } from './stores/authStore/auth.effect';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(), // Essential for making API calls!
    
    // Wire up NgRx Store and Effects
    provideStore({
      [authFeature.name]: authFeature.reducer
    }),
    provideEffects([AuthEffects]),
    
    // Optional but highly recommended: NgRx DevTools for debugging in Chrome
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })
  ]
};