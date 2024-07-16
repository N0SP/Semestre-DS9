import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ApiService } from '../../services/api.service';
import { SessionService } from '../../services/session.service';

import { tap } from 'rxjs';

import Swal from 'sweetalert2';

interface DatosUsuario {
  ID: number;
  Nombre: string;
  Apellido: string;
  Correo: string;
  Asunto: string;
  Detalles: string;
}

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit {

  private readonly apiService = inject(ApiService);
  private readonly sessionService = inject(SessionService);
  private readonly router = inject(Router);

  userID = signal<number>(0);
  datosUsuario: DatosUsuario = {} as DatosUsuario[] | any;

  ngOnInit(): void {
    this.userID.set(isNaN(parseInt(this.sessionService.getIdUserToken(), 10)) ? 0 : parseInt(this.sessionService.getIdUserToken(), 10));

    this.apiService.postUsuarioPorId('usuario/' + this.userID())
      .subscribe((data) => this.datosUsuario = data.result[0]);
  }

  async onSubmit() {

    if (this.datosUsuario.Asunto == null || this.datosUsuario.Detalles == null) {
      Swal.fire({
        position: 'center',
        icon: "info",
        title: "No se aceptan campos vacios...",
        showConfirmButton: false,
        timer: 1700,
        allowOutsideClick: false,
      });
      return
    }

    const formData = {
      "ID": this.userID(),
      "Asunto": this.datosUsuario.Asunto,
      "Detalles": this.datosUsuario.Detalles
    }

    this.apiService.postContact('contacto', formData)
      .pipe(
        tap(async response => {
          switch (response.status) {

            case 201:
              Swal.fire({
                title: 'Mensaje enviado',
                text: 'Gracias por contactarnos',
                icon: 'success',
                confirmButtonText: 'Aceptar'
              }).then((result) => { if (result.isConfirmed) { this.router.navigate(['/home']) } });
              break;

            case 400:
              Swal.fire({
                title: 'Error',
                text: 'No se pudo enviar el mensaje',
                icon: 'error',
                confirmButtonText: 'Aceptar'
              });
              break;
          }
        })
      ).subscribe();
  }
}
