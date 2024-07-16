import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-step2',
  standalone: true,
  imports: [CommonModule, SkeletonModule],
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss']
})
export class Step2Component implements OnInit {
  @Output() totalChange = new EventEmitter<number>();
  @Output() boletosSeleccionadosChange = new EventEmitter<any[]>(); // Emitir los boletos seleccionados

  ID: string | null | undefined;
  listaBoletos: any[] = [];
  listaPuestos: number[] = [];
  boletosFiltrados: any[] = [];
  loading = true;
  subtotal = 0;
  impuesto = 0;
  total = 0;
  private readonly impuestoRate = 0.07;

  private readonly apiService = inject(ApiService);
  private readonly activatedRoute = inject(ActivatedRoute);

  ngOnInit() {
    this.ID = this.activatedRoute.snapshot.paramMap.get('id');
    // console.log('ID:', this.ID);

    const storedPuestos = localStorage.getItem('listaPuestos');

    if (storedPuestos) {
      const parsedPuestos = JSON.parse(storedPuestos) as string[];
      this.listaPuestos = parsedPuestos.map(puesto => parseInt(puesto, 10));
      // console.log('Lista de puestos:', this.listaPuestos);
    }

    if (this.ID) {
      this.apiService.getBoletoPorIdEvento('boleto/' + this.ID).subscribe(
        (response) => {
          // console.log('Response:', response);
          if (response && response.result) {
            this.listaBoletos = response.result;
            // console.log('Lista de boletos:', this.listaBoletos);

            this.listaPuestos.forEach((puesto: number) => {
              const boletosFiltradosPorPuesto = this.listaBoletos.filter(boleto => {
                switch (puesto) {
                  case 1: return boleto.Seccion === 'Platino';
                  case 2: return boleto.Seccion === 'Gold';
                  case 3: return boleto.Seccion === 'Silver';
                  case 4: return boleto.Seccion === 'General';
                  default: return false;
                }
              });
              this.boletosFiltrados = this.boletosFiltrados.concat(boletosFiltradosPorPuesto);
            });

            this.calculateSubtotal();
            this.boletosSeleccionadosChange.emit(this.boletosFiltrados); // Emitir los boletos seleccionados
            this.loading = false;
          } else {
            console.error('Invalid response structure', response);
            this.loading = false;
          }
        },
        (error) => {
          console.error('Error fetching data', error);
          this.loading = false;
        }
      );
    } else {
      console.error('ID is null');
      this.loading = false;
    }
  }

  calculateSubtotal() {
    this.subtotal = this.boletosFiltrados.reduce((acc, boleto) => acc + parseFloat(boleto.Precio), 0);
    this.impuesto = this.subtotal * this.impuestoRate;
    this.total = this.subtotal + this.impuesto;
    this.totalChange.emit(this.total);
  }
}
