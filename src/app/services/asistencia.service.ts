import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Asistencia } from '../core/models/asistencia.model';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  private readonly URL = `${environment.api}/api/asistencia`; // ✅ AGREGADO /api/

  constructor(private http: HttpClient) { }

  checkin(): Observable<string> {
    return this.http.post(`${this.URL}/checkin`, {}, { responseType: 'text' });
  }

  checkout(): Observable<string> {
    return this.http.post(`${this.URL}/checkout`, {}, { responseType: 'text' });
  }

  getHistorial(): Observable<Asistencia[]> {
    return this.http.get<Asistencia[]>(`${this.URL}/historial`);
  }

  getReportePorFechas(desde: string, hasta: string): Observable<Asistencia[]> {
    return this.http.get<Asistencia[]>(`${this.URL}/reportes/fechas`, {
      params: { desde, hasta }
    });
  }
}