import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsistenciaService } from 'src/app/services/asistencia.service';
import { Asistencia } from '@core/models/asistencia.model';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styleUrls: ['./historial.component.css'],
  standalone: false
})
export class HistorialComponent implements OnInit {
  asistencias: Asistencia[] = [];
  filtroDesde: string = '';
  filtroHasta: string = '';
  cargando: boolean = false;

  constructor(private asistenciaService: AsistenciaService) { }

  ngOnInit(): void {
    this.cargarHistorial();
  }

  cargarHistorial(): void {
    this.cargando = true;
    this.asistenciaService.getHistorial().subscribe({
      next: (data) => {
        this.asistencias = data;
        this.cargando = false;
      },
      error: (err) => {
        this.cargando = false;
      }
    });
  }

  aplicarFiltros(): void {
    if (this.filtroDesde && this.filtroHasta) {
      this.cargando = true;
      this.asistenciaService.getReportePorFechas(this.filtroDesde, this.filtroHasta).subscribe({
        next: (data) => {
          this.asistencias = data;
          this.cargando = false;
        },
        error: (err) => {
          this.cargando = false;
        }
      });
    }
  }

  limpiarFiltros(): void {
    this.filtroDesde = '';
    this.filtroHasta = '';
    this.cargarHistorial();
  }
  calcularHoras(asistencia: Asistencia): string {
    if (!asistencia.entrada || !asistencia.salida) return 'N/A';
    
    const entrada = new Date(asistencia.entrada);
    const salida = new Date(asistencia.salida);
    const diffMs = salida.getTime() - entrada.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHrs}h ${diffMins}m`;
  }
}