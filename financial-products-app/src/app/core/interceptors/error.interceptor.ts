import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

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

      alert(message);

      return throwError(() => error);

    })

  );

};