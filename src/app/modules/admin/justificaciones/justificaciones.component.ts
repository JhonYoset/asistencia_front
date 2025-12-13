import { Component, OnInit } from '@angular/core';
import { JustificacionService } from 'src/app/services/justificacion.service';
import { Justificacion } from '@core/models/justificacion.model';

@Component({
  selector: 'app-justificaciones',
  templateUrl: './justificaciones.component.html',
  styleUrls: ['./justificaciones.component.css']
})
export class JustificacionesComponent implements OnInit {
  justificaciones: Justificacion[] = [];
  cargando = true;
  mensaje = '';
  error = '';

  constructor(private justificacionService: JustificacionService) {}

  ngOnInit(): void {
    this.cargarPendientes();
  }

  cargarPendientes() {
    this.cargando = true;
    this.mensaje = '';
    this.error = '';

    // Temporal: usar historial o implementar endpoint real
    // Aquí puedes usar un mock o el endpoint que tengas
    this.justificacionService.getJustificacionesPendientes().subscribe({
      next: (data) => {
        this.justificaciones = data;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'No se pudieron cargar las justificaciones';
        this.cargando = false;
      }
    });
  }

  aprobar(id: number) {
    this.justificacionService.aprobarJustificacion(id).subscribe({
      next: (msg) => {
        this.mensaje = msg;
        this.cargarPendientes(); // Recargar lista
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'Error al aprobar';
      }
    });
  }
}