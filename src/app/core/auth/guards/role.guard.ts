import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRole } from '../../enums/user-role.enum';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const required = (route.data?.['roles'] as UserRole[] | undefined) ?? [];

  if (required.length === 0 || auth.hasAnyRole(required)) {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};
