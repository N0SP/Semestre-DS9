import { Component, Output, EventEmitter } from '@angular/core';

import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-homecito',
  standalone: true,
  imports: [ImageModule, ButtonModule],
  templateUrl: './homecito.component.html',
  styleUrl: './homecito.component.scss'
})
export class HomecitoComponent {

  @Output() verEventosClicked = new EventEmitter<void>();

  emitirEventoVerEventos = () => this.verEventosClicked.emit();  
}