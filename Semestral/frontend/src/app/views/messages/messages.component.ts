import { Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { SkeletonModule } from 'primeng/skeleton';
import { TableModule } from 'primeng/table';

import { ApiService } from '../../services/api.service';
import { SessionService } from '../../services/session.service';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [SkeletonModule, TableModule, FontAwesomeModule],
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);
  private readonly sessionService = inject(SessionService);

  userID = signal<number>(0);
  userRol = signal<number>(0);
  loading = true;

  listaMessages: any[] = []
  messagesUser: any[] = []

  faEye = faEye;
  faCheck = faCheck;
  faTimes = faTimes;

  ngOnInit(): void {
    const idUserToken = parseInt(this.sessionService.getIdUserToken(), 10);
    const idRolToken = parseInt(this.sessionService.getIdRolToken(), 10);

    this.userID.set(isNaN(idUserToken) ? 0 : idUserToken);
    this.userRol.set(isNaN(idRolToken) ? 0 : idRolToken);

    const endpoint = this.userRol() === 1 ? 'contacto/all' : `contacto/user/${this.userID()}`;
    const method = this.userRol() === 1 ? this.apiService.getMessages : this.apiService.postMessagePorIdUser;

    method.call(this.apiService, endpoint)
      .subscribe((data) => {        
        this.listaMessages = data.result;
        this.loading = false;
      });
  }

  statusMessage = (id: number) => this.router.navigate(['/message', id]);
}