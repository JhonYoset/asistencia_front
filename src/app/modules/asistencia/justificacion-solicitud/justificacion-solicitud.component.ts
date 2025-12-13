import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { JustificacionService } from 'src/app/services/justificacion.service';

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

  constructor(private justificacionService: JustificacionService) {}

  ngOnInit(): void {
    // Establecer fecha de hoy por defecto
    const hoy = new Date().toISOString().split('T')[0];
    this.formJustificacion.patchValue({ fecha: hoy });
  }

  solicitarJustificacion(): void {
    // Marcar todos los campos como touched para mostrar errores
    Object.keys(this.formJustificacion.controls).forEach(key => {
      this.formJustificacion.get(key)?.markAsTouched();
    });

    if (!this.formJustificacion.valid) {
      this.error = 'Por favor completa todos los campos correctamente';
      return;
    }

    this.cargando = true;
    this.mensaje = '';
    this.error = '';

    // ✅ ENVIAR DIRECTAMENTE LOS VALORES DEL FORMULARIO
    const justificacion = {
      fecha: this.formJustificacion.value.fecha!, // Viene como string "yyyy-MM-dd"
      tipo: this.formJustificacion.value.tipo!,
      motivo: this.formJustificacion.value.motivo!.trim()
    };

    console.log('Enviando justificación:', justificacion);

    this.justificacionService.solicitarJustificacion(justificacion).subscribe({
      next: (response) => {
        console.log('Respuesta exitosa:', response);
        this.mensaje = `✅ Justificación enviada correctamente\n` +
                      `ID: ${response.id}\n` +
                      `Estado: ${response.estado}`;
        
        // Resetear formulario
        this.formJustificacion.reset({
          tipo: 'TARDANZA',
          fecha: new Date().toISOString().split('T')[0]
        });
        
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error completo:', err);
        console.error('Error body:', err.error);
        
        // Intentar obtener mensaje de error del backend
        if (err.error && typeof err.error === 'object' && err.error.mensaje) {
          this.error = err.error.mensaje;
        } else if (err.error && typeof err.error === 'string') {
          this.error = err.error;
        } else if (err.message) {
          this.error = err.message;
        } else {
          this.error = 'Error al enviar la justificación. Verifica la consola para más detalles.';
        }
        
        this.cargando = false;
      }
    });
  }

  get fechaInvalida(): boolean {
    const control = this.formJustificacion.get('fecha');
    return !!(control?.invalid && control?.touched);
  }

  get motivoInvalido(): boolean {
    const control = this.formJustificacion.get('motivo');
    return !!(control?.invalid && control?.touched);
  }

  get caracteresRestantes(): number {
    const motivo = this.formJustificacion.get('motivo')?.value || '';
    return Math.max(0, 10 - motivo.length);
  }
}