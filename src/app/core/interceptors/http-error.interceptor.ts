import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { LoggingService } from '@shared/services/logging.service';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(private loggingService : LoggingService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error : HttpErrorResponse) => {
        this.loggingService.logHttpError(error);
        switch(error.status){
          case 400:
            console.warn('Bad Request')
            break;
          case 401:
            console.warn('Unauthorised diego quispe')
            break;
          case 404:
            console.warn('Not found')
            break;
          case 500:
            console.warn('Internal Server error')
        }

        return throwError(() => error)
      })
    )
  }
}
