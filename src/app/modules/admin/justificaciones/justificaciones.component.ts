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
    
    console.log('=== Cargando justificaciones pendientes ===');
    
    this.justificacionService.getJustificacionesPendientes().subscribe({
      next: (data) => {
        console.log('✅ Justificaciones recibidas:', data);
        this.justificaciones = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar justificaciones:', err);
        this.error = 'No se pudieron cargar las justificaciones';
        this.cargando = false;
      }
    });
  }

  aprobar(id: number) {
    if (!id) {
      this.error = 'ID de justificación inválido';
      return;
    }

    if (confirm('¿Está seguro de aprobar esta justificación?')) {
      console.log('=== Aprobando justificación ID:', id, '===');
      
      this.justificacionService.aprobarJustificacion(id).subscribe({
        next: (msg) => {
          console.log('✅ Justificación aprobada:', msg);
          this.mensaje = msg;
          this.cargarPendientes();  
          setTimeout(() => {
            this.mensaje = '';
          }, 3000);
        },
        error: (err) => {
          console.error('❌ Error al aprobar:', err);
          this.error = err.error?.mensaje || 'Error al aprobar la justificación';
          
          setTimeout(() => {
            this.error = '';
          }, 3000);
        }
      });
    }
  }
 
  hayJustificaciones(): boolean {
    return this.justificaciones && this.justificaciones.length > 0;
  }
}