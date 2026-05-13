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
      if (!token || !authState.isAuthenticated) {
        return router.parseUrl('/login');
      }
      const data = route.data?.['roles'] ? route : route.firstChild;
      const allowedRoles = data?.data?.['roles'] as string[];

      console.log('AuthGuard - Target Allowed Roles:', allowedRoles);

      if (authState.user) {
        const userRole = authState.user.role?.toUpperCase();
        
        if (allowedRoles && !allowedRoles.includes(userRole)) {
          console.warn(`Access Denied: Role ${userRole} not in ${allowedRoles}`);
          return router.parseUrl('/login');
        }
      }
      return true;// User is authenticated but profile is still loading, allow access for now
    })
  );
};