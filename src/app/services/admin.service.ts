import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Usuario } from '../core/models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly URL = `${environment.api}/api/admin`;

  constructor(private http: HttpClient) { }

  crearUsuario(usuario: Usuario): Observable<string> {
    return this.http.post(`${this.URL}/usuarios`, usuario, { responseType: 'text' });
  }

  getEstadisticas(): Observable<any> {
    return this.http.get(`${this.URL}/estadisticas`);
  }

  getReporteCompleto(desde: string, hasta: string): Observable<any> {
    return this.http.get(`${this.URL}/reporte-completo`, {
      params: { desde, hasta }
    });
  }
}