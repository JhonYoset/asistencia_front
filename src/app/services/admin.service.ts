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
    return this.http.post(`${this.URL}/usuarios`, usuario, { 
      responseType: 'text' 
    });
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.URL}/usuarios`);
  }

  getUsuarioPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.URL}/usuarios/${id}`);
  }

  actualizarUsuario(id: number, usuario: Usuario): Observable<string> {
    return this.http.put(`${this.URL}/usuarios/${id}`, usuario, { 
      responseType: 'text' 
    });
  }

  desactivarUsuario(id: number): Observable<string> {
    return this.http.put(`${this.URL}/usuarios/${id}/desactivar`, {}, { 
      responseType: 'text' 
    });
  }

  activarUsuario(id: number): Observable<string> {
    return this.http.put(`${this.URL}/usuarios/${id}/activar`, {}, { 
      responseType: 'text' 
    });
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