import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Asistencia } from '../core/models/asistencia.model';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  private readonly URL = `${environment.api}/api/asistencia`;

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
    let params = new HttpParams();
    
    if (desde) {
      params = params.set('desde', desde);
    }
    
    if (hasta) {
      params = params.set('hasta', hasta);
    }
        
    return this.http.get<Asistencia[]>(`${this.URL}/reportes/fechas`, {
      params: params
    });
  }

  getEstadoActual(): Observable<any> {
    return this.http.get(`${this.URL}/estado-actual`);
  }
}