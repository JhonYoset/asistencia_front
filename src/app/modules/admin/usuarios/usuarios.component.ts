import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AdminService } from 'src/app/services/admin.service';
import { Usuario } from '@core/models/usuario.model'; // Solo Usuario

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  formUsuario = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required, Validators.minLength(5)]),
    nombre: new FormControl('', [Validators.required]),
    rol: new FormControl('EMPLEADO', [Validators.required])
  });

  cargando = false;
  cargandoLista = false;
  mensaje = '';
  error = '';
  
  usuarios: Usuario[] = []; // Solo Usuario
  usuariosFiltrados: Usuario[] = []; // Solo Usuario
  filtroBusqueda: string = '';

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

  // El resto del código se mantiene igual...
  filtrarUsuarios(): void {
    if (!this.filtroBusqueda.trim()) {
      this.usuariosFiltrados = [...this.usuarios];
      return;
    }
    
    const busqueda = this.filtroBusqueda.toLowerCase().trim();
    this.usuariosFiltrados = this.usuarios.filter(usuario => 
      usuario.username.toLowerCase().includes(busqueda) ||
      (usuario.nombre && usuario.nombre.toLowerCase().includes(busqueda)) ||
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
        nombre: this.formUsuario.value.nombre!.trim() || this.formUsuario.value.username!.trim(),
        rol: this.formUsuario.value.rol!.toUpperCase(),
        enabled: true
      };

      console.log('Enviando usuario:', usuario);

      this.adminService.crearUsuario(usuario).subscribe({
        next: (msg) => {
          this.mensaje = msg;
          this.formUsuario.reset({ rol: 'EMPLEADO' });
          this.cargando = false;
          this.cargarUsuarios(); // Recargar lista
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
    }
  }

  activarUsuario(id: number | undefined) {
    if (id && confirm('¿Activar este usuario?')) {
      this.adminService.activarUsuario(id).subscribe({
        next: (msg) => {
          this.mensaje = msg;
          this.cargarUsuarios(); // Recargar lista
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
          this.cargarUsuarios(); // Recargar lista
        },
        error: (err) => {
          this.error = 'Error al desactivar usuario: ' + (err.error?.mensaje || 'Intente nuevamente');
        }
      });
    }
  }

  editarUsuario(usuario: Usuario) {
    console.log('Editar usuario:', usuario);
    
    this.formUsuario.patchValue({
      username: usuario.username,
      nombre: usuario.nombre || usuario.username,
      rol: usuario.rol,
      password: ''
    });
    
    this.mensaje = 'Modo edición activado. Cambie los datos y haga clic en Actualizar';
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
}