import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { Usuario } from '@core/models/usuario.model';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  formUsuario = new FormGroup({
    username: new FormControl('', [Validators.required, Validators.minLength(3)]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
    nombreCompleto: new FormControl('', [Validators.required, Validators.minLength(3)]),
    rol: new FormControl('EMPLEADO', [Validators.required])
  });

  cargando = false;
  cargandoLista = false;
  mensaje = '';
  error = '';
  
  usuarios: Usuario[] = [];
  usuariosFiltrados: Usuario[] = [];
  filtroBusqueda: string = '';
  
  modoEdicion = false;
  usuarioEditandoId?: number;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios(): void {
    this.cargandoLista = true;
    this.adminService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.usuariosFiltrados = [...data];
        this.cargandoLista = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.error = 'No se pudieron cargar los usuarios';
        this.cargandoLista = false;
      }
    });
  }

  filtrarUsuarios(): void {
    if (!this.filtroBusqueda.trim()) {
      this.usuariosFiltrados = [...this.usuarios];
      return;
    }
    
    const busqueda = this.filtroBusqueda.toLowerCase().trim();
    this.usuariosFiltrados = this.usuarios.filter(usuario => 
      usuario.username.toLowerCase().includes(busqueda) ||
      usuario.nombreCompleto.toLowerCase().includes(busqueda) ||
      usuario.rol.toLowerCase().includes(busqueda)
    );
  }

  crearUsuario() {
    if (this.formUsuario.valid) {
      this.cargando = true;
      this.mensaje = '';
      this.error = '';

      const usuario: Usuario = {
        username: this.formUsuario.value.username!.trim(),
        password: this.formUsuario.value.password!,
        nombreCompleto: this.formUsuario.value.nombreCompleto!.trim(),
        rol: this.formUsuario.value.rol!.toUpperCase(),
        enabled: true
      };

      console.log('Enviando usuario:', usuario);

      this.adminService.crearUsuario(usuario).subscribe({
        next: (msg) => {
          this.mensaje = msg;
          this.formUsuario.reset({ rol: 'EMPLEADO' });
          this.cargando = false;
          this.modoEdicion = false;
          this.usuarioEditandoId = undefined;
          this.cargarUsuarios();
        },
        error: (err) => {
          console.error('Error detallado:', err);
          this.error = err.error?.mensaje || 'Error al crear el usuario';
          if (err.status === 400) {
            this.error = 'Datos inválidos: ' + (err.error?.mensaje || 'Verifique los campos');
          }
          this.cargando = false;
        }
      });
    } else {
      this.error = 'Por favor complete todos los campos requeridos';
      this.marcarCamposComoTocados();
    }
  }

  actualizarUsuario() {
    if (!this.usuarioEditandoId) {
      this.error = 'No hay usuario en edición';
      return;
    }

    if (this.formUsuario.valid) {
      this.cargando = true;
      this.mensaje = '';
      this.error = '';

      const usuario: Usuario = {
        username: this.formUsuario.value.username!.trim(),
        password: this.formUsuario.value.password || '',
        nombreCompleto: this.formUsuario.value.nombreCompleto!.trim(),
        rol: this.formUsuario.value.rol!.toUpperCase()
      };

      this.adminService.actualizarUsuario(this.usuarioEditandoId, usuario).subscribe({
        next: (msg) => {
          this.mensaje = msg;
          this.formUsuario.reset({ rol: 'EMPLEADO' });
          this.cargando = false;
          this.modoEdicion = false;
          this.usuarioEditandoId = undefined;
          this.cargarUsuarios();
        },
        error: (err) => {
          this.error = 'Error al actualizar usuario: ' + (err.error?.mensaje || 'Intente nuevamente');
          this.cargando = false;
        }
      });
    } else {
      this.error = 'Por favor complete todos los campos requeridos';
      this.marcarCamposComoTocados();
    }
  }

  editarUsuario(usuario: Usuario) {
    console.log('Editar usuario:', usuario);
    
    this.modoEdicion = true;
    this.usuarioEditandoId = usuario.id;
    
    this.formUsuario.patchValue({
      username: usuario.username,
      nombreCompleto: usuario.nombreCompleto,
      rol: usuario.rol,
      password: '' // No mostrar la contraseña
    });
    
    // Hacer que la contraseña sea opcional en modo edición
    this.formUsuario.get('password')?.clearValidators();
    this.formUsuario.get('password')?.updateValueAndValidity();
    
    this.mensaje = 'Modo edición activado. Cambie los datos y haga clic en Actualizar';
    
    // Scroll al formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicion() {
    this.modoEdicion = false;
    this.usuarioEditandoId = undefined;
    this.formUsuario.reset({ rol: 'EMPLEADO' });
    
    // Restaurar validación de contraseña
    this.formUsuario.get('password')?.setValidators([Validators.required, Validators.minLength(5)]);
    this.formUsuario.get('password')?.updateValueAndValidity();
    
    this.mensaje = '';
    this.error = '';
  }

  activarUsuario(id: number | undefined) {
    if (id && confirm('¿Activar este usuario?')) {
      this.adminService.activarUsuario(id).subscribe({
        next: (msg) => {
          this.mensaje = msg;
          this.cargarUsuarios();
        },
        error: (err) => {
          this.error = 'Error al activar usuario: ' + (err.error?.mensaje || 'Intente nuevamente');
        }
      });
    }
  }

  desactivarUsuario(id: number | undefined) {
    if (id && confirm('¿Desactivar este usuario?')) {
      this.adminService.desactivarUsuario(id).subscribe({
        next: (msg) => {
          this.mensaje = msg;
          this.cargarUsuarios();
        },
        error: (err) => {
          this.error = 'Error al desactivar usuario: ' + (err.error?.mensaje || 'Intente nuevamente');
        }
      });
    }
  }

  private marcarCamposComoTocados() {
    Object.keys(this.formUsuario.controls).forEach(key => {
      this.formUsuario.get(key)?.markAsTouched();
    });
  }

  getTotalUsuarios(): number {
    return this.usuarios.length;
  }

  getUsuariosActivos(): number {
    return this.usuarios.filter(u => u.enabled).length;
  }

  getUsuariosInactivos(): number {
    return this.usuarios.filter(u => !u.enabled).length;
  }
  
  formatearFecha(fecha: Date | string | undefined): string {
    if (!fecha) return 'No registrado';
    
    const date = new Date(fecha);
    return isNaN(date.getTime()) ? 'Fecha inválida' : date.toLocaleDateString('es-ES');
  }

  // Getters para validaciones del formulario
  get usernameInvalido(): boolean {
    const control = this.formUsuario.get('username');
    return !!(control?.invalid && control?.touched);
  }

  get passwordInvalido(): boolean {
    const control = this.formUsuario.get('password');
    return !!(control?.invalid && control?.touched);
  }

  get nombreCompletoInvalido(): boolean {
    const control = this.formUsuario.get('nombreCompleto');
    return !!(control?.invalid && control?.touched);
  }
}