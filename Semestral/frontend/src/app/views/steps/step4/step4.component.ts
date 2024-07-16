import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrCodeModule } from 'ng-qrcode';

@Component({
  selector: 'app-step4',
  standalone: true,
  imports: [CommonModule, QrCodeModule],
  templateUrl: './step4.component.html',
  styleUrls: ['./step4.component.scss']
})
export class Step4Component implements OnInit {
  @Input() transactionId: string | null = '';
  @Input() eventName: string | null = '';
  @Input() eventDate: string | null = '';
  @Input() eventPlace: string | null = '';
  @Input() tickets: { type: string, quantity: number, qrCode: string }[] = [];

  ngOnInit(): void {
  }
}
