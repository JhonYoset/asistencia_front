import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { JustificacionService } from 'src/app/services/justificacion.service';
import { JustificacionRequest } from '@core/models/justificacion.model';

@Component({
  selector: 'app-justificacion-solicitud',
  templateUrl: './justificacion-solicitud.component.html',
  styleUrls: ['./justificacion-solicitud.component.css']
})
export class JustificacionSolicitudComponent implements OnInit {
  formJustificacion = new FormGroup({
    fecha: new FormControl('', [Validators.required]),
    tipo: new FormControl('TARDANZA', [Validators.required]),
    motivo: new FormControl('', [Validators.required, Validators.minLength(10)])
  });

  cargando = false;
  mensaje = '';
  error = '';
  historialJustificaciones: any[] = [];

  constructor(private justificacionService: JustificacionService) {}

  ngOnInit(): void {
    // Opcional: cargar historial de justificaciones del usuario
  }

  solicitarJustificacion(): void {
    if (this.formJustificacion.valid) {
      this.cargando = true;
      this.mensaje = '';
      this.error = '';

      const justificacion: JustificacionRequest = {
        fecha: new Date(this.formJustificacion.value.fecha!),
        tipo: this.formJustificacion.value.tipo as 'TARDANZA' | 'AUSENCIA',
        motivo: this.formJustificacion.value.motivo!
      };

      this.justificacionService.solicitarJustificacion(justificacion).subscribe({
        next: (response) => {
          this.mensaje = `Justificación enviada correctamente. ID: ${response.id}`;
          this.formJustificacion.reset({ tipo: 'TARDANZA' });
          this.cargando = false;
        },
        error: (err) => {
          this.error = err.error?.mensaje || 'Error al enviar la justificación';
          this.cargando = false;
        }
      });
    } else {
      this.error = 'Por favor completa todos los campos correctamente';
    }
  }

  get fechaInvalida(): boolean {
    const control = this.formJustificacion.get('fecha');
    return !!(control?.invalid && control?.touched);
  }

  get motivoInvalido(): boolean {
    const control = this.formJustificacion.get('motivo');
    return !!(control?.invalid && control?.touched);
  }
}