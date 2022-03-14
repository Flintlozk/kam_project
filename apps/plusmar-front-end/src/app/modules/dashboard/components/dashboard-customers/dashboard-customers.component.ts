import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { IDashboardCustomers } from '@reactor-room/itopplus-model-lib';

@Component({
  selector: 'reactor-room-dashboard-customers',
  templateUrl: './dashboard-customers.component.html',
  styleUrls: ['./dashboard-customers.component.scss'],
})
export class DashboardCustomersComponent implements OnInit, OnChanges {
  @Input() data: IDashboardCustomers[];
  @Input() isLoading = false;
  loadingText = 'Loading...';
  topPadding = '20px';

  constructor() {}

  ngOnInit(): void {
    if (window.innerWidth <= 768) {
      this.topPadding = '10px';
    } else this.topPadding = '20px';
  }

  ngOnChanges(changes: SimpleChanges): void {}
}
