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
      
      this.authService.login(
        this.formLogin.value.username,
        this.formLogin.value.password
      ).subscribe({
        next: (token) => {
          // Obtener roles del token
          const roles = this.authService.getUserRoles();
          
          // Redirigir según el rol
          if (roles.includes('ROLE_ADMIN')) {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/empleado/checkin']);
          }
          
          this.cargando = false;
        },
        error: (error) => {
          console.error('Login failed', error);
          this.errorSession = true;
          this.mensajeError = error.error?.mensaje || 'Credenciales inválidas';
          this.cargando = false;
        }
      });
    }
  }
}