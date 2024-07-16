import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { tap, catchError } from 'rxjs';

import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, InputTextModule, DropdownModule, FloatLabelModule, PasswordModule, ButtonModule, FontAwesomeModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})

export class RegisterComponent {

  faEye = faEye;
  faEyeSlash = faEyeSlash;

  private readonly router = inject(Router);
  private readonly apiService = inject(ApiService);
  private readonly authService = inject(AuthService);

  name: string = "";
  lastname: string = "";
  email: string = "";
  password: string = "";
  id_rol: number = 0;

  passwordVisible: boolean = false;  

  async onSubmit() {
    if (this.name != "" && this.lastname != "" && this.email != "" && this.password != "" && this.id_rol != 0) {

      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

      if (!emailPattern.test(this.email)) {
        Swal.fire({
          position: 'center',
          icon: "info",
          title: "Correo inválido",
          text: "El correo debe tener un formato válido...",
          showConfirmButton: false,
          timer: 2000,
          allowOutsideClick: false,
        });
        return;
      }

      Swal.fire({
        icon: 'info',
        title: 'Registrando usuario...',
        text: 'Espere un momento...',
        allowOutsideClick: false,
        showConfirmButton: false,
        allowEscapeKey: false,
        willOpen: () => {
          Swal.showLoading();
        }
      });

      const formData = {
        Nombre: this.name,
        Apellido: this.lastname,
        Correo: this.email,
        Contrasena: await this.authService.hashPassword(this.password),
        ID_RolUsuario: this.id_rol
      };

      this.apiService.postUsuario('usuario', formData)
        .pipe(
          tap(response => {

            switch (response.status) {
              case 201:
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: "Registro exitoso",
                  showConfirmButton: false,
                  timer: 1500
                });
              
                setTimeout(() => {
                  this.router.navigate(['/login']);
                }, 1500);              
                break;

              case 404:
                Swal.fire({
                  position: 'center',
                  icon: "info",
                  title: "No se encontró la ruta...",
                  showConfirmButton: false,
                  timer: 1700,
                  allowOutsideClick: false,
                });
                break;

              case 409:
                Swal.fire({
                  position: 'center',
                  icon: "info",
                  title: "El correo ya está registrado...",
                  showConfirmButton: false,
                  timer: 1700,
                  allowOutsideClick: false,
                });
                break;

              case 500:
                console.log('Error al enviar los datos:', response);
                break;

            }

          }),
          catchError(error => {
            console.log('Error al enviar los datos:', error);
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
