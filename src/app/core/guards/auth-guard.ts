import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { selectAuthState } from '../../stores/authStore/auth.features';

export const authGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);
  const token = localStorage.getItem('token');

  return store.select(selectAuthState).pipe(
    take(1),
    map((authState) => {

      // 2. If no token and not authenticated, force login
      if (!token &&!authState.isAuthenticated) {
        return router.parseUrl('/login');
      }

      // 3. Role-Based Check (if user object has arrived)
      if (authState.user) {
        const allowedRoles = route.data?.['roles'] as string[];
        const userRole = authState.user.role?.toUpperCase();
        if (allowedRoles && !allowedRoles.includes(userRole)) {
          return router.parseUrl('/login');
        }
      }

      return true;
    })
  );
};