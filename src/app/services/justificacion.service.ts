import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Justificacion } from '../core/models/justificacion.model';

@Injectable({
  providedIn: 'root'
})
export class JustificacionService {
  private readonly URL = `${environment.api}/api/asistencia`;

  constructor(private http: HttpClient) { }

  solicitarJustificacion(justificacion: any): Observable<Justificacion> {
    // ✅ CONVERTIR FECHA A FORMATO STRING yyyy-MM-dd
    const payload = {
      fecha: this.formatearFecha(justificacion.fecha),
      tipo: justificacion.tipo,
      motivo: justificacion.motivo
    };
    
    console.log('Payload a enviar:', payload);
    
    return this.http.post<Justificacion>(`${this.URL}/justificaciones_solicitud`, payload);
  }

  aprobarJustificacion(id: number): Observable<string> {
    return this.http.put(`${this.URL}/justificaciones_aprobacion/${id}`, {}, { responseType: 'text' });
  }

  getJustificacionesPendientes(): Observable<Justificacion[]> {
    return this.http.get<Justificacion[]>(`${environment.api}/api/admin/justificaciones/pendientes`);
  }

  // ✅ MÉTODO AUXILIAR PARA FORMATEAR FECHA
  private formatearFecha(fecha: Date | string): string {
    if (typeof fecha === 'string') {
      // Si ya es string en formato yyyy-MM-dd, devolverlo tal cual
      if (/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        return fecha;
      }
      fecha = new Date(fecha);
    }
    
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  }
}