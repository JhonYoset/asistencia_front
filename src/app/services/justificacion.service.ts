import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Justificacion } from '../core/models/justificacion.model';

@Injectable({
  providedIn: 'root'
})
export class JustificacionService {
  private readonly URL = `${environment.api}/api`;

  constructor(private http: HttpClient) { }

  // Solicitar nueva justificación (empleado)
  solicitarJustificacion(data: any): Observable<any> {
    return this.http.post(`${this.URL}/asistencia/justificacion`, data);
  }

  // Obtener justificaciones pendientes (admin) - ACTUALIZADO CON TIPO CORRECTO
  getJustificacionesPendientes(): Observable<Justificacion[]> {
    return this.http.get<Justificacion[]>(`${this.URL}/admin/justificaciones/pendientes`);
  }

  // Aprobar justificación (admin)
  aprobarJustificacion(id: number): Observable<string> {
    return this.http.post(`${this.URL}/asistencia/justificacion/${id}/aprobar`, {}, {
      responseType: 'text'
    });
  }

  // Obtener historial de justificaciones del usuario actual
  getMisJustificaciones(): Observable<Justificacion[]> {
    return this.http.get<Justificacion[]>(`${this.URL}/asistencia/mis-justificaciones`);
  }
}