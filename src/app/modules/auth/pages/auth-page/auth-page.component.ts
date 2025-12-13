import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.css']
})
export class AuthPageComponent implements OnInit {
  errorSession: boolean = false;
  mensajeError: string = '';
  formLogin: FormGroup = new FormGroup({});
  cargando: boolean = false;

  ngOnInit(): void {
    this.formLogin = new FormGroup({
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  sendLogin(): void {
    if (this.formLogin.valid) {
      this.cargando = true;
      this.errorSession = false;
      
      const username = this.formLogin.value.username;
      const password = this.formLogin.value.password;
      
      console.log('Intentando login con:', { username, password });
      
      this.authService.login(username, password).subscribe({
        next: (token) => {
          console.log('Login exitoso, token recibido:', token);
          
          // Obtener roles del token
          const roles = this.authService.getUserRoles();
          console.log('Roles del usuario:', roles);
          
          // Redirigir según el rol
          if (roles.includes('ROLE_ADMIN')) {
            console.log('Redirigiendo a dashboard admin');
            this.router.navigate(['/admin/dashboard']);
          } else {
            console.log('Redirigiendo a checkin empleado');
            this.router.navigate(['/empleado/checkin']);
          }
          
          this.cargando = false;
        },
        error: (error) => {
          console.error('Error en login:', error);
          this.errorSession = true;
          this.mensajeError = error.error?.mensaje || 'Credenciales inválidas';
          
          // Para debugging, muestra más información
          if (error.status === 0) {
            this.mensajeError = 'No se puede conectar al servidor. Verifica que el backend esté corriendo en http://localhost:8080';
          } else if (error.status === 401) {
            this.mensajeError = 'Usuario o contraseña incorrectos';
          } else if (error.status === 404) {
            this.mensajeError = 'Endpoint no encontrado. Verifica la URL del backend';
          }
          
          this.cargando = false;
        }
      });
    }
  }
}