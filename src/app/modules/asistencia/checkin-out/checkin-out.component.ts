import { Component, OnInit } from '@angular/core';


import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AsistenciaService } from 'src/app/services/asistencia.service';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-checkin-out',
  templateUrl: './checkin-out.component.html',
  styleUrls: ['./checkin-out.component.css'],
  standalone: false
})
export class CheckinOutComponent implements OnInit {
  mensaje: string = '';
  error: string = '';
  ultimaAsistencia: any = null;
  enOficina: boolean = false;

  constructor(
    private asistenciaService: AsistenciaService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.cargarEstadoActual();
  }

  cargarEstadoActual(): void {
    // Implementar lógica para verificar si hay check-in activo
    this.enOficina = false; // Cambiar según lógica real
  }

  realizarCheckin(): void {
    this.asistenciaService.checkin().subscribe({
      next: (response) => {
        this.mensaje = response;
        this.error = '';
        this.enOficina = true;
        this.cargarEstadoActual();
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'Error al realizar check-in';
        this.mensaje = '';
      }
    });
  }

  realizarCheckout(): void {
    this.asistenciaService.checkout().subscribe({
      next: (response) => {
        this.mensaje = response;
        this.error = '';
        this.enOficina = false;
        this.cargarEstadoActual();
      },
      error: (err) => {
        this.error = err.error?.mensaje || 'Error al realizar check-out';
        this.mensaje = '';
      }
    });
  }

  logout(): void {
    this.authService.logout();
    window.location.reload();
  }
}