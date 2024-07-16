import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { tap, catchError } from 'rxjs';

import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, InputTextModule, FloatLabelModule, PasswordModule, ButtonModule, ImageModule, FontAwesomeModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private readonly router = inject(Router);
  private readonly apiService = inject(ApiService);
  private readonly authService = inject(AuthService);
  private readonly sessionService = inject(SessionService);

  email: string = "";
  password: string = "";

  passwordVisible: boolean = false;

  faEye = faEye;
  faEyeSlash = faEyeSlash;

  constructor() { }

  async onSubmit() {
    Swal.fire({
      icon: 'info',
      title: 'Iniciando sesion...',
      text: 'Espere un momento...',
      allowOutsideClick: false,      
      showConfirmButton: false,
      allowEscapeKey: false,
      willOpen: () => {
        Swal.showLoading();
      }
    });

    if (this.email != "" && this.password != "") {

      const formData = {
        Correo: this.email
      };

      this.apiService.postLogin('usuario/login', formData)
        .pipe(
          tap(async response => {
            switch (response.status) {
              case 201:
                Swal.close();
                const result = await this.authService.verifyPassword(this.password, response.result[0].Contrasena);

                if (result) {
                  Swal.fire({
                    position: "center",
                    icon: "success",
                    title: "Sesion iniciada correctamente",
                    showConfirmButton: false,
                    timer: 1500
                  });

                  setTimeout(() => {
                    this.sessionService.setSessionToken(response.result[0]);
                    this.router.navigate([(response.result[0].ID_RolUsuario === 1) ? '/events' : '/home']);
                  }, 1500);

                } else {
                  Swal.fire({
                    position: 'center',
                    icon: "info",
                    title: "Credenciales incorrectas...",
                    showConfirmButton: false,
                    timer: 1700,
                    allowOutsideClick: false,
                  });
                }
                break;

              case 404:
                Swal.fire({
                  position: 'center',
                  icon: "info",
                  title: "Credenciales incorrectas...",
                  showConfirmButton: false,
                  timer: 1700,
                  allowOutsideClick: false,
                });
                break;

            }

          }),
          catchError(error => {
            // console.error('Error al enviar los datos:', error);
            throw error;
          })
        ).subscribe();

    } else {
      Swal.fire({
        position: 'center',
        icon: "info",
        title: "No se aceptan campos vacios...",
        showConfirmButton: false,
        timer: 1700,
        allowOutsideClick: false,
      });
    }
  }

  viewPassword(passwordInput: HTMLInputElement) {
    this.passwordVisible = !this.passwordVisible;
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  }


}
