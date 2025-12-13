import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

interface TokenPayload {
  roles: string[];
  sub: string;
}

// Función para decodificar JWT sin dependencia externa
const decodeJWT = (token: string): TokenPayload | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

export const roleGuard: CanActivateFn = (route, state) => {
  const cookieService = inject(CookieService);
  const router = inject(Router);
  
  try {
    const token = cookieService.get('token');
    if (!token) {
      router.navigate(['/auth']);
      return false;
    }

    const decoded = decodeJWT(token);
    if (!decoded) {
      router.navigate(['/auth']);
      return false;
    }

    const requiredRole = route.data['role'];
    
    if (decoded.roles && decoded.roles.includes(`ROLE_${requiredRole}`)) {
      return true;
    }
    
    // Redirigir según el rol del usuario
    if (decoded.roles.includes('ROLE_ADMIN')) {
      router.navigate(['/admin/dashboard']);
    } else {
      router.navigate(['/empleado/checkin']);
    }
    
    return false;
  } catch (error) {
    console.error('Error in role guard:', error);
    router.navigate(['/auth']);
    return false;
  }
};