import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { UserRole } from '../../enums/user-role.enum';

export const roleRedirectGuard: CanActivateFn = (_route, _state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const roles = auth.roles();

  if (roles.includes(UserRole.PRESIDENT)) return router.createUrlTree(['/president']);
  if (roles.includes(UserRole.SECRETARY)) return router.createUrlTree(['/secretary']);
  if (roles.includes(UserRole.TREASURER)) return router.createUrlTree(['/treasurer']);
  if (roles.includes(UserRole.AUDITOR)) return router.createUrlTree(['/auditor']);
  if (roles.includes(UserRole.CENSOR)) return router.createUrlTree(['/censor']);

  return true; // MEMBER → reste sur /dashboard
};
