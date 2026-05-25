import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notifications = inject(NotificationService);
  const auth = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/')) {
        notifications.warning('Votre session a expiré. Veuillez vous reconnecter.');
        auth.logout();
      } else if (error.status === 403) {
        notifications.error("Vous n'avez pas la permission d'effectuer cette action.");
      } else if (error.status >= 500) {
        notifications.error('Une erreur serveur est survenue. Veuillez réessayer.');
      } else if (error.status === 0) {
        notifications.error('Connexion au serveur impossible.');
      }
      return throwError(() => error);
    }),
  );
};
