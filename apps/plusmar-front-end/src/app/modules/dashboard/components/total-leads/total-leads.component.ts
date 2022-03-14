import { Component, OnInit, Input } from '@angular/core';
import { IDashboardWidgets } from '@reactor-room/itopplus-model-lib';

@Component({
  selector: 'reactor-room-total-leads',
  templateUrl: './total-leads.component.html',
  styleUrls: ['./total-leads.component.scss'],
})
export class TotalLeadsComponent implements OnInit {
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
