import { Component, OnInit, inject, signal, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

import { HomecitoComponent } from '../../components/homecito/homecito.component';
import { CardComponent } from '../../components/card/card.component';

import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';

import { ApiService } from '../../services/api.service';
import { SessionService } from '../../services/session.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, HomecitoComponent, CardComponent, ButtonModule, SkeletonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  private readonly router = inject(Router);
  private readonly apiService = inject(ApiService);
  private readonly sessionService = inject(SessionService);

  private userRoleSubscription: Subscription | null = null;

  @ViewChild('cardsSection') cardsSection: ElementRef | undefined;

  userRol = signal<number>(0);
  userID = signal<number>(0);
  cards: any[] = [];
  loading = true;

  ngOnInit() {
    this.sessionService.userRole$.subscribe(roleId => this.userRol.set(roleId));
    this.sessionService.userID$.subscribe(userId => this.userID.set(userId));
    this.userRol.set(isNaN(parseInt(this.sessionService.getIdRolToken(), 10)) ? 0 : parseInt(this.sessionService.getIdRolToken(), 10));
    this.userID.set(isNaN(parseInt(this.sessionService.getIdUserToken(), 10)) ? 0 : parseInt(this.sessionService.getIdUserToken(), 10));

    this.apiService.getEventos('evento').subscribe((response) => {      
      this.cards = response.result;
      response.result.forEach((evento: { Dia_Hora_Inicio: string; }) => {
        const fecha = new Date(evento.Dia_Hora_Inicio);
        const dia = fecha.getDate();
        const mes = fecha.toLocaleString('default', { month: 'short' }).toUpperCase();
        const fechaFormateada = `${dia} ${mes}`;
        evento.Dia_Hora_Inicio = fechaFormateada.toString();
      });
      this.loading = false;   
    });
  }

  scrollToCards() {
    if (this.cardsSection && this.cardsSection.nativeElement) {
      this.cardsSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  buyEvent(id: number) {
    if (this.userRol() != 0) {
      this.router.navigate(['/buy', id]);
    } else {
      Swal.fire({
        title: '¿Desea iniciar sesión?',
        text: 'Para comprar boletos primero debe iniciar sesión',
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Sí, iniciar sesión'
      }).then((result) => {
        if (result.isConfirmed) {
          this.router.navigate(['/login']);
        }
      });
    }
  }
}