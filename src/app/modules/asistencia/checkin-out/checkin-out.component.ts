import { Component, OnInit } from '@angular/core';
import { AsistenciaService } from 'src/app/services/asistencia.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-checkin-out',
  templateUrl: './checkin-out.component.html',
  styleUrls: ['./checkin-out.component.css']
})
export class CheckinOutComponent implements OnInit {
  mensaje: string = '';
  error: string = '';
  enOficina: boolean = false;
  cargando: boolean = false;
  ultimaEntrada?: Date;
  ultimaSalida?: Date;

  constructor(
    private asistenciaService: AsistenciaService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    console.log('CheckinOutComponent iniciado');
    this.cargarEstadoActual();
  }

  cargarEstadoActual(): void {
    console.log('Cargando estado actual...');
    this.cargando = true;
    
    this.asistenciaService.getHistorial().subscribe({
      next: (asistencias) => {
        console.log('Historial recibido:', asistencias);
        
        if (asistencias && asistencias.length > 0) {
          // Ordenar por fecha descendente (más reciente primero)
          asistencias.sort((a, b) => {
            const fechaA = a.entrada ? new Date(a.entrada).getTime() : 0;
            const fechaB = b.entrada ? new Date(b.entrada).getTime() : 0;
            return fechaB - fechaA;
          });
          
          const ultimaAsistencia = asistencias[0];
          
          // Verificar si es de hoy
          const hoy = new Date();
          const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
          const finHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);
          
          if (ultimaAsistencia.entrada) {
            const fechaEntrada = new Date(ultimaAsistencia.entrada);
            
            if (fechaEntrada >= inicioHoy && fechaEntrada < finHoy) {
              // Es de hoy, verificar estado
              this.ultimaEntrada = fechaEntrada;
              this.ultimaSalida = ultimaAsistencia.salida ? new Date(ultimaAsistencia.salida) : undefined;
              
              // ✅ Determinar si está en oficina (tiene entrada pero no salida)
              this.enOficina = !!ultimaAsistencia.entrada && !ultimaAsistencia.salida;
            } else {
              // No hay asistencia de hoy
              this.enOficina = false;
              this.ultimaEntrada = undefined;
              this.ultimaSalida = undefined;
            }
          } else {
            this.enOficina = false;
          }
        } else {
          // No hay asistencias
          this.enOficina = false;
          this.ultimaEntrada = undefined;
          this.ultimaSalida = undefined;
        }
        
        console.log('Estado calculado - enOficina:', this.enOficina);
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar historial:', err);
        this.error = 'Error al cargar estado de asistencia';
        this.enOficina = false;
        this.cargando = false;
      }
    });
  }

  realizarCheckin(): void {
    console.log('Intentando CHECK-IN...');
    this.cargando = true;
    this.mensaje = '';
    this.error = '';
    
    this.asistenciaService.checkin().subscribe({
      next: (response) => {
        console.log('CHECK-IN exitoso:', response);
        this.mensaje = response;
        this.enOficina = true; // ✅ Actualizar inmediatamente
        this.cargando = false;
        
        // Recargar estado después de 1 segundo
        setTimeout(() => {
          this.cargarEstadoActual();
        }, 1000);
      },
      error: (err) => {
        console.error('Error en CHECK-IN:', err);
        this.error = err.error?.mensaje || 'Error al realizar check-in';
        this.cargando = false;
      }
    });
  }

  realizarCheckout(): void {
    console.log('Intentando CHECK-OUT...');
    this.cargando = true;
    this.mensaje = '';
    this.error = '';
    
    this.asistenciaService.checkout().subscribe({
      next: (response) => {
        console.log('CHECK-OUT exitoso:', response);
        this.mensaje = response;
        this.enOficina = false; // ✅ Actualizar inmediatamente
        this.cargando = false;
        
        // Recargar estado después de 1 segundo
        setTimeout(() => {
          this.cargarEstadoActual();
        }, 1000);
      },
      error: (err) => {
        console.error('Error en CHECK-OUT:', err);
        this.error = err.error?.mensaje || 'Error al realizar check-out';
        this.cargando = false;
      }
    });
  }

  logout(): void {
    // Confirmar si está en oficina
    if (this.enOficina) {
      if (!confirm('Tienes un check-in activo. ¿Estás seguro de que quieres cerrar sesión sin hacer check-out?')) {
        return;
      }
    }
    this.authService.logout();
  }

  formatearHora(fecha?: Date): string {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleTimeString('es-PE', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }

  obtenerEstadoTexto(): string {
    return this.enOficina ? 'EN OFICINA' : 'FUERA DE OFICINA';
  }

  obtenerClaseEstado(): string {
    return this.enOficina ? 'text-success' : 'text-danger';
  }
}