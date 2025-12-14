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

  solicitarJustificacion(data: any): Observable<any> {
    return this.http.post(`${this.URL}/asistencia/justificacion`, data);
  }

  getJustificacionesPendientes(): Observable<Justificacion[]> {
    return this.http.get<Justificacion[]>(`${this.URL}/admin/justificaciones/pendientes`);
  }

  aprobarJustificacion(id: number): Observable<string> {
    return this.http.post(`${this.URL}/asistencia/justificacion/${id}/aprobar`, {}, {
      responseType: 'text'
    });
  }

  getMisJustificaciones(): Observable<Justificacion[]> {
    return this.http.get<Justificacion[]>(`${this.URL}/asistencia/mis-justificaciones`);
  }
}