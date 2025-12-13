import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent {
  formUsuario = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
    rol: new FormControl('EMPLEADO', [Validators.required])
  });

  cargando = false;
  mensaje = '';
  error = '';

  constructor(private adminService: AdminService) {}

  crearUsuario() {
    if (this.formUsuario.valid) {
      this.cargando = true;
      this.mensaje = '';
      this.error = '';

      const usuario = {
        username: this.formUsuario.value.username!,
        password: this.formUsuario.value.password!,
        nombre: this.formUsuario.value.username!,
        rol: this.formUsuario.value.rol!
      };

      this.adminService.crearUsuario(usuario).subscribe({
        next: (msg) => {
          this.mensaje = msg;
          this.formUsuario.reset({ rol: 'EMPLEADO' });
          this.cargando = false;
        },
        error: (err) => {
          this.error = err.error?.mensaje || 'Error al crear el usuario';
          this.cargando = false;
        }
      });
    }
  }
}