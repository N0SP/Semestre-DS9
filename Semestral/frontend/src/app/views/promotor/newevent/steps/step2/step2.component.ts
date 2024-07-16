import { Component, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormStateService } from '../../../../../services/form-state.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SessionService } from '../../../../../services/session.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-step2',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FontAwesomeModule],
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss']
})
export class Step2Component implements OnInit {
  @Output() next = new EventEmitter<void>();
  @Output() previous = new EventEmitter<void>();
  form: FormGroup;
  userId: number = 0; // Inicialización de userId

  private readonly httpClient = inject(HttpClient);
  private readonly formStateService = inject(FormStateService);
  private readonly router = inject(Router);
  private readonly sessionService = inject(SessionService);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      seatpriceplatino: ['', Validators.required],
      seatpricegold: ['', Validators.required],
      seatpricesilver: ['', Validators.required],
      seatpricegeneral: ['', Validators.required],
      seatquantityplatino: ['', Validators.required],
      seatquantitygold: ['', Validators.required],
      seatquantitysilver: ['', Validators.required],
      seatquantitygeneral: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const data = this.formStateService.getFormData('step2');
    this.form.patchValue(data);
    this.userId = parseInt(this.sessionService.getIdUserToken(), 10);
  }

  onNext() {
    if (this.form.invalid) {
      Swal.fire('Error', 'Por favor, completa todos los campos.', 'error');
      return;
    }
    this.formStateService.setFormData('step2', this.form.value);
    this.submitEvent();
  }

  onPrevious() {
    this.formStateService.setFormData('step2', this.form.value);
    this.previous.emit();
  }

  submitEvent() {
    if (this.form.invalid) {
      Swal.fire('Error', 'Por favor, completa todos los campos.', 'error');
      return;
    }

    const combinedData = {
      ...this.formStateService.getCombinedFormData(),
      ...this.form.value,
      id_promotor: this.userId
    };

    this.httpClient.post('http://localhost:4000/api/evento/eventos', combinedData)
      .subscribe({
        next: (response: any) => {
          if (response.status === 201) {
            this.formStateService.clearFormData();
            Swal.fire('Éxito', response.message, 'success').then(() => {
              this.router.navigate(['/']);
            });
          } else {
            Swal.fire('Error', response.message, 'error');
          }
        },
        error: (error) => {
          console.error('Error creando el evento:', error);
          Swal.fire('Error', 'Error creando el evento. Intente nuevamente.', 'error');
        }
      });
  }
}
