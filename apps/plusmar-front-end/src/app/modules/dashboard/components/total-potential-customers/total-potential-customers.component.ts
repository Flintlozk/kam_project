import { Component, OnInit, Input } from '@angular/core';
import { IDashboardWidgets } from '@reactor-room/itopplus-model-lib';

@Component({
  selector: 'reactor-room-total-potential-customers',
  templateUrl: './total-potential-customers.component.html',
  styleUrls: ['./total-potential-customers.component.scss'],
})
export class TotalPotentialCustomersComponent implements OnInit {
  @Input() data: IDashboardWidgets;
  width = '150px';
  height = '150px';
  constructor() {}

  ngOnInit(): void {
    if (window.innerWidth <= 768) {
      this.width = '100px';
      this.height = '100px';
    } else {
      this.width = '150px';
      this.height = '150px';
    }
  }
}
