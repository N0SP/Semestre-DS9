import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { ApiService } from '../../services/api.service';

import Swal from 'sweetalert2';

interface Messages {
  ID: number,
  Nombre: string,
  Apellido: string,
  Correo: string,
  Asunto: string,
  Detalles: string,
  Status: number
}

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent implements OnInit {

  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  ID: string | null | undefined;
  listaMessages: Messages = {} as Messages;
  respuesta: string = '';

  ngOnInit(): void {
    this.ID = this.activatedRoute.snapshot.paramMap.get('id');

    this.apiService.postMessagePorId(`contacto/${this.ID}`)
      .subscribe((data) => this.listaMessages = data.result[0]);
  }

  onSubmit() {
    Swal.fire({
      icon: 'info',
      title: 'Enviando mensaje',
      text: 'Espere un momento...',
      showConfirmButton: false,
      allowOutsideClick: false,
      allowEscapeKey: false,
      willOpen: () => {
        Swal.showLoading();
      }
    });

    const formData = {
      "Respuesta": this.respuesta,
      "ID_Contacto": this.ID
    }

    this.apiService.postMessage('contacto/response', formData)
      .subscribe((data) => {
        if (data.status === 201) {
          Swal.fire({
            icon: 'success',
            title: 'Mensaje enviado',
            text: 'El mensaje ha sido enviado correctamente',
            showConfirmButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false
          }).then(() => {
            this.router.navigate(['/messages']);
          });
        }
        else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ha ocurrido un error al enviar el mensaje',
            showConfirmButton: true,
            allowOutsideClick: false,
            allowEscapeKey: false
          })
        }
      });
  }
}

