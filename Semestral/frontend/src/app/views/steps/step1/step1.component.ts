import { Component, OnInit, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PanelModule } from 'primeng/panel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-step1',
  standalone: true,
  imports: [CommonModule, FormsModule, PanelModule],
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss']
})
export class Step1Component implements OnInit, AfterViewInit {
  ticketsCount = 1;
  ticketTypes = [
    { name: 'Platinum', value: 1 },
    { name: 'Gold', value: 2 },
    { name: 'Silver', value: 3 },
    { name: 'General', value: 4 }
  ];

  listaPuestos: number[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    const storedPuestos = localStorage.getItem('listaPuestos');
    if (storedPuestos) {
      const parsedPuestos = JSON.parse(storedPuestos) as string[];
      this.listaPuestos = parsedPuestos.map(puesto => parseInt(puesto, 10));
      (this.listaPuestos.length > 0) ? this.ticketsCount = this.listaPuestos.length : '';
    }
  }

  ngAfterViewInit(): void {
    this.setBoletos();
  }

  onTicketsCountChange(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = parseInt(input.value, 10);
    if (isNaN(value) || value < 1) {
      value = 1;
    }
    this.ticketsCount = value;
  }

  setBoletos() {
    document.querySelectorAll('select').forEach((select: HTMLSelectElement, index) => {
      if (index < this.listaPuestos.length) {
        select.value = this.listaPuestos[index].toString();
      }
    });
  }

  guardarBoletos() {
    const listaPuestos: number[] = [];
    document.querySelectorAll('select').forEach((select: HTMLSelectElement) => {
      listaPuestos.push(parseInt(select.value, 10));
    });
    localStorage.setItem('listaPuestos', JSON.stringify(listaPuestos));
    this.router.navigate(['/step2']);
  }
}
