import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { ModalService } from '../../shared/services/modal.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const modalService = inject(ModalService);

  return next(req).pipe(

    catchError((error) => {

      let message = 'Unexpected error';

      if (error.error?.message) {
        message = error.error.message;
      }

      if (error.status === 400) {
        message = error.error?.message || 'Bad request';
      }

      if (error.status === 404) {
        message = error.error?.message || 'Resource not found';
      }

      if (error.status === 500) {
        message = 'Internal server error';
      }

      modalService.confirm({
        title: 'Error',
        message: message,
        showCancel: false,
        confirmText: 'Cerrar'
      }).subscribe();

      return throwError(() => error);

    })

  );

};