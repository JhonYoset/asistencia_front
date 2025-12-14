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
        console.log('📤 Petición de login - sin token');
        return next.handle(request);
      }

      const token = this.authService.getToken();
      
      if (token && token.length > 20) {
        console.log('📤 Agregando token a petición:', request.url);
        console.log('   Token (primeros 50 caracteres):', token.substring(0, 50) + '...');
        
        const newRequest = request.clone({
          setHeaders: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        return next.handle(newRequest).pipe(
          catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
              console.error('❌ Error 401 - Token inválido o expirado');
              console.error('   URL:', request.url);
              console.error('   Token usado:', token.substring(0, 50) + '...');
              
              
              this.authService.logout();
            }
            return throwError(() => error);
          })
        );
      } else {
        console.warn('⚠️ No hay token válido disponible para:', request.url);
        
        if (request.url.includes('/api/')) {
          console.error('❌ Intento de acceder a ruta protegida sin token');
          this.router.navigate(['/auth']);
          return throwError(() => new Error('No hay token de autenticación'));
        }
        
        return next.handle(request);
      }
    } catch (error) {
      console.error('❌ Error en InjectSessionInterceptor:', error);
      return next.handle(request);
    }
  }
}