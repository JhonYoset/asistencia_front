import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class InjectSessionInterceptor implements HttpInterceptor {

  constructor(
    private cookieService: CookieService,
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    try {
      
      if (request.url.includes('/auth/login')) {
        return next.handle(request);
      }

      const token = this.authService.getToken();
      
      if (token && token.length > 20) {
        
        const newRequest = request.clone({
          setHeaders: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        return next.handle(newRequest).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              this.authService.logout();
            }
            return throwError(() => error);
          })
        );
      } else {
        
        if (request.url.includes('/api/')) {
          this.router.navigate(['/auth']);
          return throwError(() => new Error('No hay token de autenticación'));
        }
        
        return next.handle(request);
      }
    } catch (error) {
      return next.handle(request);
    }
  }
}