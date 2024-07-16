import { Component, AfterViewInit, ElementRef, ViewChild, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../../services/api.service';
import { SessionService } from '../../../services/session.service';

@Component({
  selector: 'app-step3',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './step3.component.html',
  styleUrls: ['./step3.component.scss']
})
export class Step3Component implements AfterViewInit {
  @ViewChild('paypalButtonContainer', { static: false }) paypalButtonContainer!: ElementRef;
  @Input() totalAmount: number = 0;
  @Input() eventoId: string | null = null;
  @Input() boletos: any[] = [];
  @Output() paymentApproved = new EventEmitter<string>(); // Emit transactionId
  @Output() paymentError = new EventEmitter<void>();
  @Output() paymentCancel = new EventEmitter<void>();
  userId: number = 0;
  private readonly apiService = inject(ApiService);
  private readonly sessionService = inject(SessionService);

  selectedPaymentOption: string | null = null;
  private paypalButton: HTMLElement | null = null;

  ngOnInit(): void {
    this.userId = parseInt(this.sessionService.getIdUserToken(), 10);
  }

  togglePaymentOption(option: string) {
    this.selectedPaymentOption = this.selectedPaymentOption === option ? null : option;
    if (this.selectedPaymentOption === 'paypal') {
      setTimeout(() => this.renderPayPalButton(), 0);
    }
  }

  ngAfterViewInit() {
    if (this.selectedPaymentOption === 'paypal') {
      this.renderPayPalButton();
    }
  }

  private renderPayPalButton() {
    if (this.paypalButtonContainer && this.paypalButtonContainer.nativeElement) {
      (window as any).paypal.Buttons({
        style: {
          shape: 'rect',
          layout: 'vertical',
          color: 'blue',
          label: 'paypal'
        },
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: this.totalAmount.toFixed(2),
                  currency_code: 'USD'
                }
              }
            ]
          });
        },
        onApprove: (data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            // console.log(details);
            if (details.status === 'COMPLETED') {
              const payerName = details.payer.name.given_name + ' ' + details.payer.name.surname;
              const payerEmail = details.payer.email_address;
              this.paymentApproved.emit(details.id); // Emit transactionId
              this.registerTransaction(details.id, payerName, payerEmail);
            }
          });
        },
        onError: (error: any) => {
          console.error(error);
          this.paymentError.emit();
        },
        onCancel: (data: any) => {
          console.log(data);
          this.paymentCancel.emit();
        }
      }).render(this.paypalButtonContainer.nativeElement).then(() => {
        this.paypalButton = this.paypalButtonContainer.nativeElement.querySelector('button');
      });
    }
  }

  private registerTransaction(paypalTransactionId: string, payerName: string, payerEmail: string) {
    const boletosAgrupados = this.boletos.reduce((acc: any, boleto: any) => {
      if (!acc[boleto.Seccion]) {
        acc[boleto.Seccion] = 0;
      }
      acc[boleto.Seccion]++;
      return acc;
    }, {});

    const transactionData = {
      transactionId: paypalTransactionId,
      payerName: payerName,
      payerEmail: payerEmail,
      amount: this.totalAmount,
      currency: 'USD',
      status: 'COMPLETED',
      eventoId: Number(this.eventoId),
      usuarioId: this.userId,
      platino: boletosAgrupados['Platino'] || 0,
      gold: boletosAgrupados['Gold'] || 0,
      silver: boletosAgrupados['Silver'] || 0,
      general: boletosAgrupados['General'] || 0
    };

    // console.log('Sending transaction data:', transactionData);

    this.apiService.registrarTransaccion(transactionData).subscribe(
      response => {
        // console.log('Transaction registered:', response);
      },
      error => {
        console.error('Failed to register transaction:', error);
      }
    );
  }

  triggerPayPalButton() {
    if (this.paypalButton) {
      this.paypalButton.click();
    } else {
      console.error('PayPal button not rendered yet.');
    }
  }
}
