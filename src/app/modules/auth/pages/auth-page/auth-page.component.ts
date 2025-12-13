import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
  styleUrls: ['./auth-page.component.css']
})
export class AuthPageComponent implements OnInit{

  errorSession : boolean = false

  formLogin : FormGroup = new FormGroup({})

  ngOnInit(): void {
    this.formLogin = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  } 

  constructor(private authService : AuthService, private router : Router){
    authService.sendCredentials("", "")
  }

  sendLogin(): void {
    if (this.formLogin.valid) {
      this.authService.sendCredentials(this.formLogin.value.email, this.formLogin.value.password)
        .subscribe({
          next : (response) => {
            console.log('Login Successful', response)
            this.router.navigate(['/'])
            this.errorSession = false
          },
          error : (error) => {
            console.log('Login failed', error)
            this.errorSession = true
          }
        })
    } else {
      console.log('Formulario inválido');
    }
  }
}
