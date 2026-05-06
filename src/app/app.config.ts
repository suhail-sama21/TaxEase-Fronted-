import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';

// NgRx Imports
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { authFeature } from './stores/authStore/auth.features';
import { AuthEffects } from './stores/authStore/auth.effect';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { authInterceptor } from './core/interceptors/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
<<<<<<< HEAD
    provideHttpClient(), // Essential for making API calls! (Ithu mattum pothum)

    // Wire up NgRx Store and Effects
    provideStore({
      [authFeature.name]: authFeature.reducer
    }),
    provideEffects([AuthEffects]),

    // Optional but highly recommended: NgRx DevTools for debugging in Chrome
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
    provideCharts(withDefaultRegisterables())
    // Duplicate provideHttpClient()-ah remove panniyachu
  ]
};
=======
    provideHttpClient(withInterceptors([authInterceptor])), // <-- Added HTTP Client
    provideCharts(withDefaultRegisterables()),

    // NgRx Global Providers
    provideStore({
      // Register your auth feature state here
      [authFeature.name]: authFeature.reducer,
    }),
    provideEffects([AuthEffects]), // <-- Added Effects

    // NgRx DevTools (Highly recommended for debugging)
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: !isDevMode(), // Restrict extension to log-only mode
      autoPause: true, // Pauses recording actions and state changes when the extension window is not open
      trace: false, //  If set to true, will include stack trace for every dispatched action
      traceLimit: 75, // maximum stack trace frames to be stored (in case trace option was provided as true)
    }),
  ],
};
>>>>>>> 9c009c9a8fb8d3e1c9acba6835cab7ce5c5187c5
