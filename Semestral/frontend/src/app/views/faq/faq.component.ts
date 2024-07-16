import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';

import { AccordionModule } from 'primeng/accordion';

import { ApiService } from '../../services/api.service';
import { SessionService } from '../../services/session.service';

interface Faq {
  Titulo: string;
  Contenido: string;
  ID_RolUsuario: number;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [ReactiveFormsModule, AccordionModule, CommonModule],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss'
})
export class FaqComponent implements OnInit {

  private readonly apiService = inject(ApiService);
  private readonly sessionService = inject(SessionService);

  tabs: Faq[] = [];
  userRol = signal<number>(0);
  appointmentForm: FormGroup;

  constructor(private fb: FormBuilder,) {
    this.appointmentForm = this.fb.group({
      appointmentDateTime: ['']
    });
  }

  ngOnInit(): void {
    this.userRol.set(isNaN(parseInt(this.sessionService.getIdRolToken(), 10)) ? 0 : parseInt(this.sessionService.getIdRolToken(), 10));
    this.apiService.getFaqs('faqs').subscribe((data) => { this.tabs = data.result; });
  }
}