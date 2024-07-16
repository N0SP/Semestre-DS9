// boleto.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-boleto',
  templateUrl: './boleto.component.html',
  styleUrls: ['./boleto.component.scss']
})
export class BoletoComponent implements OnInit {
  boleto: any;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.boleto = {
        id: params['id'],
        evento: params['evento'],
        fecha: params['fecha'],
        asiento: params['asiento'],
        precio: params['precio']
      };
    });
  }
}
