import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly URL = environment.api;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router
  ) { }

  login(username: string, password: string): Observable<string> {
    const params = new HttpParams()
      .set('username', username)
      .set('password', password);
    
    console.log('🔐 Intentando login con:', { username, url: `${this.URL}/auth/login` });
    
    return this.http.post(`${this.URL}/auth/login`, {}, { 
      params, 
      responseType: 'text' 
    }).pipe(
      tap((token: string) => {
        console.log('✅ Token recibido:', token.substring(0, 50) + '...');
        const cleanToken = token.trim().replace(/^"|"$/g, '');

        if (!cleanToken || cleanToken.startsWith('{') || cleanToken.startsWith('<')) {
          console.error('❌ Token inválido recibido:', cleanToken);
          throw new Error('Token inválido recibido del servidor');
        }
        
        const parts = cleanToken.split('.');
        if (parts.length !== 3) {
          console.error('❌ Token no tiene estructura JWT válida');
          throw new Error('Token con formato inválido');
        }

        this.cookieService.delete('token', '/'); 
        this.cookieService.set('token', cleanToken, {
          expires: 1,
          path: '/',
          sameSite: 'Lax'
        });
        
        console.log('💾 Token guardado en cookie');
        
        const verificacion = this.cookieService.get('token');
        if (verificacion !== cleanToken) {
          console.error('❌ Token no se guardó correctamente');
          throw new Error('Error al guardar token');
        }
        console.log('✅ Token verificado en cookie');
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ Error en login:', {
          status: error.status,
          message: error.message,
          error: error.error
        });
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    console.log('🚪 Cerrando sesión...');
    this.cookieService.delete('token', '/');
    this.router.navigate(['/auth']);
  }

  getToken(): string {
    const token = this.cookieService.get('token');
    
    if (!token) {
      console.warn('⚠️ No hay token en cookies');
      return '';
    }
    
    const cleanToken = token.trim().replace(/^"|"$/g, '');
    
    if (cleanToken.startsWith('{') || cleanToken.startsWith('<')) {
      console.error('❌ Token corrupto detectado:', cleanToken.substring(0, 50));
      this.cookieService.delete('token', '/');
      return '';
    }
    
    const parts = cleanToken.split('.');
    if (parts.length !== 3) {
      console.error('❌ Token no tiene estructura JWT válida');
      this.cookieService.delete('token', '/');
      return '';
    }
    
    return cleanToken;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token || token.length < 20) {
      return false;
    }
    
    try {
      const payload = this.decodeToken(token);
      if (payload && payload.exp) {
        const now = Math.floor(Date.now() / 1000);
        if (payload.exp < now) {
          console.warn('⚠️ Token expirado');
          this.logout();
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error('Error validando token:', error);
      return false;
    }
  }

  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decodificando token:', error);
      return null;
    }
  }

  getUserRoles(): string[] {
    try {
      const token = this.getToken();
      if (!token) return [];
      
      const payload = this.decodeToken(token);
      return payload?.roles || [];
    } catch (error) {
      console.error('Error obteniendo roles:', error);
      return [];
    }
  }

  getUsername(): string {
    try {
      const token = this.getToken();
      if (!token) return '';
      
      const payload = this.decodeToken(token);
      return payload?.sub || '';
    } catch (error) {
      console.error('Error obteniendo username:', error);
      return '';
    }
  }
}