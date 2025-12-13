import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router'; // Importar Router
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly URL = environment.api;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private router: Router // Inyectar Router
  ) { }

  login(username: string, password: string): Observable<string> {
    const params = new HttpParams()
      .set('username', username)
      .set('password', password);
    
    return this.http.post(`${this.URL}/auth/login`, {}, { 
      params, 
      responseType: 'text' 
    }).pipe(
      tap((token: string) => {
        this.cookieService.set('token', token, 1, '/');
      })
    );
  }

  logout(): void {
    this.cookieService.delete('token', '/');
    this.router.navigate(['/auth']); // Redirigir a login
  }

  getToken(): string {
    return this.cookieService.get('token');
  }

  isLoggedIn(): boolean {
    return this.cookieService.check('token');
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
      return '';
    }
  }
}