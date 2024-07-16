import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../services/api.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../services/auth.service';
import { FormStateService } from '../../../services/form-state.service'; 
import { CardComponent } from '../../../components/card/card.component';
import { Step1Component } from './steps/step1/step1.component';
import { Step2Component } from './steps/step2/step2.component';
import { CommonModule } from '@angular/common';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-newevent',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    FontAwesomeModule,
    Step1Component,
    Step2Component
  ],
  templateUrl: './newevent.component.html',
  styleUrls: ['./newevent.component.scss']
})
export class NeweventComponent implements OnInit {
  currentStep: number = 1;
  imageUrl: string = ''; 
  eventData: any = {};

  private readonly apiService = inject(ApiService);
  private readonly authService = inject(AuthService);
  private readonly formStateService = inject(FormStateService);
  private readonly httpClient = inject(HttpClient);

  constructor(private route: ActivatedRoute, private router: Router, library: FaIconLibrary) {
    library.addIconPacks(fas);
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.currentStep = +params['step'] || 1;
    });

    // Suscribirse a los cambios de datos del formulario
    this.formStateService.formData$.subscribe(data => {
      this.eventData = data;
      this.imageUrl = data.image;
    });
  }

  goToStep(step: number) {
    this.currentStep = step;
    this.router.navigate(['/promotor/newevent', step]);
  }

  nextStep() {
    this.goToStep(this.currentStep + 1);
  }

  previousStep() {
    this.goToStep(this.currentStep - 1);
  }
}
