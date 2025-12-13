import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../../services/auth.service';

@Injectable()
export class InjectSessionInterceptor implements HttpInterceptor {

  constructor(
    private cookieService: CookieService,
    private authService: AuthService
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    try {
      const token = this.authService.getToken();
      
      if (token) {
        console.log('Agregando token a la solicitud:', token.substring(0, 20) + '...');
        
        const newRequest = request.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        
        return next.handle(newRequest);
      } else {
        console.log('No hay token disponible');
        return next.handle(request);
      }
    } catch (error) {
      console.error('Error en InjectSessionInterceptor', error);
      return next.handle(request);
    }
  }
}