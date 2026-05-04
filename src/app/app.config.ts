import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // <-- 1. Import this
import { routes } from './app.routes';

// NgRx Imports
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { authFeature } from './stores/authStore/auth.features';
import { AuthEffects } from './stores/authStore/auth.effect';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideCharts(withDefaultRegisterables())],
};
