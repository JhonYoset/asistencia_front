import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Justificacion, JustificacionRequest } from '../core/models/justificacion.model';

@Injectable({
  providedIn: 'root'
})
export class JustificacionService {
  private readonly URL = `${environment.api}/asistencia`;

  constructor(private http: HttpClient) { }

  solicitarJustificacion(justificacion: JustificacionRequest): Observable<Justificacion> {
    return this.http.post<Justificacion>(`${this.URL}/justificaciones_solicitud`, justificacion);
  }

  aprobarJustificacion(id: number): Observable<string> {
    return this.http.put(`${this.URL}/justificaciones_aprobacion/${id}`, {}, { responseType: 'text' });
  }

  getJustificacionesPendientes(): Observable<Justificacion[]> {
    // Nota: Este endpoint necesita ser implementado en el backend
    return this.http.get<Justificacion[]>(`${environment.api}/admin/justificaciones/pendientes`);
  }
}