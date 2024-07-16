import { Component, Input, Output, EventEmitter } from '@angular/core';

import { CardModule } from 'primeng/card';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CardModule, FontAwesomeModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent {
  
  faLocationDot = faLocationDot;

  @Input() ID!: number;
  @Input() Nombre: string = '';
  @Input() subheader: string = '';
  @Input() Foto: string = '';
  @Input() Lugar: string = '';
  @Input() Detalles: string = '';
  @Input() Dia_Hora_Inicio: string = '';

  @Input() disabled: boolean = false;

  @Output() buy: EventEmitter<number> = new EventEmitter<number>();

  buyEvent = () => (!this.disabled) ? this.buy.emit(this.ID) : null;
}