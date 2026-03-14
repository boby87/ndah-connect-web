import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';
import { LoadingService } from '../../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  if (req.headers.has('X-Skip-Loading')) {
    const cleanReq = req.clone({ headers: req.headers.delete('X-Skip-Loading') });
    return next(cleanReq);
  }

  loadingService.show();
  return next(req).pipe(finalize(() => loadingService.hide()));
};
