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
        console.log('✅ Token recibido (primeros 30 caracteres):', token.substring(0, 30));
        
        // ✅ VALIDAR QUE SEA UN TOKEN JWT REAL
        if (!token || token.startsWith('{') || token.startsWith('<')) {
          console.error('❌ Token inválido recibido:', token);
          throw new Error('Token inválido recibido del servidor');
        }
        
        // Guardar token
        this.cookieService.set('token', token, 1, '/');
        console.log('💾 Token guardado en cookie');
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
    
    // ✅ VALIDAR QUE EL TOKEN EXISTE Y ES VÁLIDO
    if (!token) {
      console.warn('⚠️ No hay token en cookies');
      return '';
    }
    
    if (token.startsWith('{') || token.startsWith('<')) {
      console.error('❌ Token corrupto detectado:', token.substring(0, 50));
      this.cookieService.delete('token', '/');
      return '';
    }
    
    return token;
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    return !!token && token.length > 20;
  }

  getUserRoles(): string[] {
    try {
      const token = this.getToken();
      if (!token) return [];
      
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const payload = JSON.parse(jsonPayload);
      return payload.roles || [];
    } catch (error) {
      console.error('Error decodificando roles:', error);
      return [];
    }
  }

  getUsername(): string {
    try {
      const token = this.getToken();
      if (!token) return '';
      
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      
      const payload = JSON.parse(jsonPayload);
      return payload.sub || '';
    } catch (error) {
      console.error('Error decodificando username:', error);
      return '';
    }
  }
}