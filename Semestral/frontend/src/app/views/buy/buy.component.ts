import { Component, OnInit, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuItem } from 'primeng/api';
import { StepsModule } from 'primeng/steps';
import { ApiService } from '../../services/api.service';
import { CardComponent } from '../../components/card/card.component';
import { Step1Component } from '../steps/step1/step1.component';
import { Step2Component } from '../steps/step2/step2.component';
import { Step3Component } from '../steps/step3/step3.component';
import { Step4Component } from '../steps/step4/step4.component';
import { SkeletonModule } from 'primeng/skeleton';
import Swal from 'sweetalert2';

enum Step {
  Step1 = 0,
  Step2,
  Step3,
  Step4
}

@Component({
  selector: 'app-buy',
  standalone: true,
  imports: [CommonModule, CardComponent, StepsModule, Step1Component, Step2Component, Step3Component, Step4Component, SkeletonModule],
  templateUrl: './buy.component.html',
  styleUrls: ['./buy.component.scss']
})
export class BuyComponent implements OnInit {
  Step = Step;
  ID: string | null = null;
  items: MenuItem[] = [];
  currentStep: Step = Step.Step1;
  activeIndex: number = 0;
  loading = true;
  card = { ID: 0, Nombre: '', Foto: '', Lugar: '', Dia_Hora_Inicio: '', startdate: '', enddate: '', description: '' };
  listaPuestos: any[] = [];
  total = 0;
  boletosSeleccionados: any[] = [];
  transactionId: string = '';

  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly apiService = inject(ApiService);

  ngOnInit() {
    this.clearLocalStorage();
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    this.ID = id ? id : null;

    this.items = [
      { label: 'Boletos', command: () => this.goToPage(Step.Step1) },
      { label: 'Asientos', command: () => this.goToPage(Step.Step2) },
      { label: 'Pagar', command: () => this.goToPage(Step.Step3) },
      { label: 'Confirmación', command: () => this.goToPage(Step.Step4) }
    ];

    if (this.ID) {
      this.apiService.getEventoId(`evento/${this.ID}`).subscribe((response) => {
        const evento = response.result[0];
        const fecha = new Date(evento.Dia_Hora_Inicio);
        const dia = fecha.getDate();
        const mes = fecha.toLocaleString('default', { month: 'short' }).toUpperCase();
        this.card = { 
          ...evento, 
          Dia_Hora_Inicio: `${dia} ${mes}`,
          startdate: evento.startdate,
          enddate: evento.enddate,
          description: evento.details
        };
        this.loading = false;
      });
    }
  }

  onActiveIndexChange(index: number) {
    this.activeIndex = index;
    this.currentStep = index as Step;
  }

  goToPage(step: Step) {
    this.activeIndex = step;
    this.currentStep = step;
  }

  handlePaymentApproved(transactionId: string) {
    this.transactionId = transactionId;
    this.payEvent();
  }

  payEvent() {
    console.log('Procesando pago...');

    Swal.fire({
      title: 'Procesando pago...',
      text: 'Espere un momento por favor',
      icon: 'info',
      showConfirmButton: false,
      willOpen: () => {
        Swal.showLoading();
      }
    });

    setTimeout(() => {
      Swal.fire({
        title: 'Pago exitoso',
        text: 'Se ha realizado el pago exitosamente',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      }).then(() => {
        // Navegar al paso 4
        this.goToPage(Step.Step4);
      });
    }, 2000);

    this.clearLocalStorage();
  }

  ErrorPayment() {
    Swal.fire({
      title: 'Error en el pago',
      text: 'Ha ocurrido un error en el pago, por favor intente de nuevo',
      icon: 'error',
      confirmButtonText: 'Aceptar',
      showConfirmButton: false,
      willOpen: () => {
        setTimeout(() => {
          Swal.close();
        }, 2000);
      } 
    });
  }

  CancelPayment() {
    Swal.fire({
      title: 'Pago cancelado',
      text: 'El pago ha sido cancelado',
      icon: 'info',
      confirmButtonText: 'Aceptar',
      showConfirmButton: false,
      willOpen: () => {
        setTimeout(() => {
          Swal.close();
        }, 2000);
      }
    });
  }

  goToHome = () => {
    this.clearLocalStorage();
    this.router.navigate(['/home']);
  };

  guardarPuestos() {
    this.listaPuestos = [];
    document.querySelectorAll('select').forEach((select: HTMLSelectElement) => this.listaPuestos.push(select.value));
    localStorage.setItem('listaPuestos', JSON.stringify(this.listaPuestos));
  }

  updateTotal(total: number) {
    this.total = total;
  }

  updateBoletosSeleccionados(boletos: any[]) {
    this.boletosSeleccionados = boletos;
    console.log('Boletos seleccionados actualizados:', this.boletosSeleccionados); // Añadido para depuración
  }

  clearLocalStorage() {
    localStorage.removeItem('listaPuestos');
  }
}
