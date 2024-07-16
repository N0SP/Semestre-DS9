import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FloatLabelModule } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';

import { ApiService } from '../../services/api.service';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import Swal from 'sweetalert2';

interface Usuario {
  ID_Usuario: number;
  Nombre: string;
  Apellido: string;
  Correo: string;
  Contrasena: string;
  ID_RolUsuario: number;
}

@Component({
  selector: 'app-editprofile',
  standalone: true,
  imports: [FormsModule, InputTextModule, DropdownModule, FloatLabelModule, PasswordModule, ButtonModule, FontAwesomeModule],
  templateUrl: './editprofile.component.html',
  styleUrl: './editprofile.component.scss'
})
export class EditprofileComponent implements OnInit {

  faEye = faEye;
  faEyeSlash = faEyeSlash;

  ID: string | null | undefined;
  usuario: Usuario = {
    ID_Usuario: 0,
    Nombre: '',
    Apellido: '',
    Correo: '',
    Contrasena: '',
    ID_RolUsuario: 0
  };
  passwordVisible: boolean = false;

  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.ID = this.activatedRoute.snapshot.paramMap.get('id');

    this.apiService.postUsuarioPorId(`usuario/${this.ID}`)
      .subscribe((response) => {
        this.usuario = response.result[0];
      });
  }

  onSubmit() {
    Swal.fire({
      icon: 'info',
      title: 'Actualizando usuario',
      text: 'Espere un momento...',      
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      willOpen: () => {
        Swal.showLoading();
      }
    });

    this.apiService.updateUsuario('usuario/update', this.usuario)
      .subscribe((response) => {
        if (response.status === 201) {
          Swal.fire({
            title: 'Usuario actualizado',
            text: 'El usuario ha sido actualizado con éxito',
            icon: 'success',
            showConfirmButton: false,
            timer: 1700,
            allowOutsideClick: false,
          });

          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 1700);

        } else {
          Swal.fire({
            title: 'Error al actualizar usuario',
            text: 'Ha ocurrido un error al actualizar el usuario',
            icon: 'error',
            showConfirmButton: true,
            timer: 1700,
            allowOutsideClick: false,
          });
        }
      });
  }

  viewPassword(passwordInput: HTMLInputElement) {
    this.passwordVisible = !this.passwordVisible;
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  }
}
