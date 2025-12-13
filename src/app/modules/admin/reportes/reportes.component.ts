import { Component } from '@angular/core';
import { AsistenciaService } from 'src/app/services/asistencia.service';
import { Asistencia } from '@core/models/asistencia.model';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent {
  desde: string = '';
  hasta: string = '';
  reporte: Asistencia[] = [];
  cargando = false;
  mensaje = '';
  error = '';

  constructor(private asistenciaService: AsistenciaService) {}

  generarReporte() {
    this.cargando = true;
    this.mensaje = '';
    this.error = '';
    this.reporte = [];

    this.asistenciaService.getReportePorFechas(this.desde, this.hasta).subscribe({
      next: (data) => {
        this.reporte = data;
        this.mensaje = `Reporte generado: ${data.length} registro(s) encontrado(s)`;
        this.cargando = false;
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'Error al generar el reporte';
        this.cargando = false;
      }
    });
  }

  calcularHoras(a: Asistencia): string {
    if (!a.entrada || !a.salida) return '—';
    const entrada = new Date(a.entrada);
    const salida = new Date(a.salida);
    const diff = salida.getTime() - entrada.getTime();
    const horas = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${horas}h ${mins}m`;
  }
}