import { Component, inject, OnInit, LOCALE_ID } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule, DatePipe, registerLocaleData } from '@angular/common';

import localeEs from '@angular/common/locales/es';

import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';

import { QrCodeModule } from 'ng-qrcode';

import { ApiService } from '../../services/api.service';

registerLocaleData(localeEs);

@Component({
  selector: 'app-history',
  standalone: true,
  imports: [CommonModule, DataViewModule, ButtonModule, QrCodeModule],
  providers: [DatePipe, { provide: LOCALE_ID, useValue: 'es' }],
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly apiService = inject(ApiService);
  private readonly datePipe = inject(DatePipe);

  ID: string | null | undefined;
  lista: any[] = [];
  baseUrl = 'http://localhost:3000/boleto';

  ngOnInit(): void {
    this.ID = this.activatedRoute.snapshot.paramMap.get('id');    

    this.apiService.get(`transaccion/${this.ID}`)
      .subscribe((data: any) => {
        if (data.success) {
          this.lista = data.result.reverse();
          
          this.lista.forEach((element: any) => {
            element.fecha = this.datePipe.transform(element.Fecha, 'fullDate');
            element.qrData = `${this.baseUrl}?id=${element.ID_Transaccion}&evento=${element.NombreEvento}&fecha=${element.Fecha}&precio=${element.Pago}`;
          });
        }
      });
  }
}