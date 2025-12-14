import { Component, OnInit } from '@angular/core';
import { AsistenciaService } from 'src/app/services/asistencia.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

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
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    console.log('=== INICIO CheckinOutComponent ===');
    
    // Verificar que el usuario esté autenticado
    if (!this.authService.isLoggedIn()) {
      console.error('❌ Usuario no autenticado');
      this.error = 'Sesión no válida. Por favor, inicia sesión nuevamente.';
      this.router.navigate(['/auth']);
      return;
    }
    
    // Verificar que el token existe
    const token = this.authService.getToken();
    console.log('Token disponible:', token ? 'SÍ' : 'NO');
    if (token) {
      console.log('Token (primeros 50 caracteres):', token.substring(0, 50) + '...');
    }
    
    this.cargarEstadoActual();
  }

  cargarEstadoActual(): void {
    console.log('=== Cargando estado actual ===');
    this.cargando = true;
    this.error = '';
    
    this.asistenciaService.getHistorial().subscribe({
      next: (asistencias) => {
        console.log('✅ Historial recibido:', asistencias.length, 'registros');
        
        if (asistencias && asistencias.length > 0) {
          // Ordenar por fecha descendente (más reciente primero)
          asistencias.sort((a, b) => {
            const fechaA = a.entrada ? new Date(a.entrada).getTime() : 0;
            const fechaB = b.entrada ? new Date(b.entrada).getTime() : 0;
            return fechaB - fechaA;
          });
          
          const ultimaAsistencia = asistencias[0];
          console.log('Última asistencia:', ultimaAsistencia);
          
          // Verificar si es de hoy
          const hoy = new Date();
          const inicioHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
          const finHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);
          
          if (ultimaAsistencia.entrada) {
            const fechaEntrada = new Date(ultimaAsistencia.entrada);
            
            if (fechaEntrada >= inicioHoy && fechaEntrada < finHoy) {
              // Es de hoy
              this.ultimaEntrada = fechaEntrada;
              this.ultimaSalida = ultimaAsistencia.salida ? new Date(ultimaAsistencia.salida) : undefined;
              
              // ✅ Determinar si está en oficina
              this.enOficina = !!ultimaAsistencia.entrada && !ultimaAsistencia.salida;
              
              console.log('Estado calculado:');
              console.log('  - En oficina:', this.enOficina);
              console.log('  - Última entrada:', this.ultimaEntrada);
              console.log('  - Última salida:', this.ultimaSalida);
            } else {
              // No hay asistencia de hoy
              console.log('No hay registros de hoy');
              this.enOficina = false;
              this.ultimaEntrada = undefined;
              this.ultimaSalida = undefined;
            }
          }
        } else {
          // No hay asistencias
          console.log('No hay registros de asistencia');
          this.enOficina = false;
          this.ultimaEntrada = undefined;
          this.ultimaSalida = undefined;
        }
        
        this.cargando = false;
      },
      error: (err) => {
        console.error('❌ Error al cargar historial:', err);
        console.error('   Status:', err.status);
        console.error('   Message:', err.message);
        console.error('   Error completo:', err);
        
        // Mensajes de error más específicos
        if (err.status === 401) {
          this.error = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
          setTimeout(() => {
            this.authService.logout();
          }, 2000);
        } else if (err.status === 0) {
          this.error = 'No se puede conectar con el servidor. Verifica que el backend esté corriendo.';
        } else {
          this.error = 'Error al cargar estado de asistencia: ' + (err.error?.mensaje || err.message);
        }
        
        this.enOficina = false;
        this.cargando = false;
      }
    });
  }

  realizarCheckin(): void {
    console.log('=== INICIANDO CHECK-IN ===');
    this.cargando = true;
    this.mensaje = '';
    this.error = '';
    
    this.asistenciaService.checkin().subscribe({
      next: (response) => {
        console.log('✅ CHECK-IN exitoso:', response);
        this.mensaje = response;
        this.enOficina = true;
        this.cargando = false;
        
        // Recargar estado después de 1 segundo
        setTimeout(() => {
          this.cargarEstadoActual();
        }, 1000);
      },
      error: (err) => {
        console.error('❌ Error en CHECK-IN:', err);
        
        if (err.status === 401) {
          this.error = 'Sesión expirada. Redirigiendo a login...';
          setTimeout(() => {
            this.authService.logout();
          }, 2000);
        } else {
          this.error = err.error?.mensaje || 'Error al realizar check-in';
        }
        
        this.cargando = false;
      }
    });
  }

  realizarCheckout(): void {
    console.log('=== INICIANDO CHECK-OUT ===');
    this.cargando = true;
    this.mensaje = '';
    this.error = '';
    
    this.asistenciaService.checkout().subscribe({
      next: (response) => {
        console.log('✅ CHECK-OUT exitoso:', response);
        this.mensaje = response;
        this.enOficina = false;
        this.cargando = false;
        
        // Recargar estado después de 1 segundo
        setTimeout(() => {
          this.cargarEstadoActual();
        }, 1000);
      },
      error: (err) => {
        console.error('❌ Error en CHECK-OUT:', err);
        
        if (err.status === 401) {
          this.error = 'Sesión expirada. Redirigiendo a login...';
          setTimeout(() => {
            this.authService.logout();
          }, 2000);
        } else {
          this.error = err.error?.mensaje || 'Error al realizar check-out';
        }
        
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