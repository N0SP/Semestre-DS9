import { Component, inject, OnInit } from '@angular/core';

import { TableModule } from 'primeng/table';

import { ApiService } from '../../services/api.service';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [TableModule, FontAwesomeModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {

  private readonly apiService = inject(ApiService);

  listaUsuarios: any[] = [];

  faTrash = faTrash;

  ngOnInit(): void {
    this.apiService.getUsers('usuario').subscribe((response) => {
      this.listaUsuarios = response.result;
    });
  }

  eliminarUsuario(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'No podrás revertir esto',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.apiService.deleteUser('usuario/delete/'+ id).subscribe(() => {
          this.listaUsuarios = this.listaUsuarios.filter(usuario => usuario.id !== id);
        });
        Swal.fire('Eliminado', 'El usuario ha sido eliminado', 'success')
        .then(() => window.location.reload());        
      }
    });
  }

}
