import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../../services/notification.service';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notification = inject(NotificationService);
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError(error => {
      switch (error.status) {
        case 401:
          authService.logout();
          break;
        case 403:
          notification.error('Accès non autorisé');
          router.navigate(['/error/403']);
          break;
        case 404:
          notification.error('Ressource introuvable');
          break;
        case 422:
          notification.error(error.error?.message || 'Données invalides');
          break;
        case 500:
          notification.error('Erreur serveur. Veuillez réessayer.');
          break;
        default:
          if (error.status === 0) {
            notification.error('Connexion impossible au serveur');
          } else {
            notification.error(error.error?.message || 'Une erreur est survenue');
          }
      }
      return throwError(() => error);
    })
  );
};
