import { Component, inject, OnInit, LOCALE_ID } from '@angular/core';
import { DatePipe, registerLocaleData } from '@angular/common';
import { Router } from '@angular/router';

import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';

import { ApiService } from '../../services/api.service';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

import localeEs from '@angular/common/locales/es';
registerLocaleData(localeEs);

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [TableModule, DatePipe, SkeletonModule, FontAwesomeModule],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.scss'],
  providers: [DatePipe, { provide: LOCALE_ID, useValue: 'es' }]
})
export class EventsComponent implements OnInit {

  private readonly apiService = inject(ApiService);
  private readonly datePipe = inject(DatePipe);
  private readonly router = inject(Router);

  listaEventos: any[] = [];
  loading = true;

  faEye = faEye;
  faCheck = faCheck;
  faTimes = faTimes;

  ngOnInit() {
    this.apiService.getEventos('evento')
      .subscribe(response => {
        this.listaEventos = response.result;
      });
      this.loading = false;
  }

  formatDate = (date: string) => this.datePipe.transform(date, 'fullDate', '', 'es');
  formatTime = (date: string) => this.datePipe.transform(date, 'shortTime', '', 'es');
  
  statusEvento = (id: number) => this.router.navigate(['/event/', id]);  
}