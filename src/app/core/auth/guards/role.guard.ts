import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRole } from '../../enums';

export const roleGuard: CanActivateFn = (route) => {
  const router = inject(Router);
  const requiredRoles = route.data?.['roles'] as UserRole[] | undefined;

  if (!requiredRoles || requiredRoles.length === 0) {
    return true;
  }

  // The current member role will be checked from TontineStore at runtime
  // For now, allow access – role enforcement done in TontineStore integration
  return true;
};
