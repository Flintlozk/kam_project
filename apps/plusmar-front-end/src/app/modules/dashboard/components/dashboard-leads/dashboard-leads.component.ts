import { Component, OnInit, Input } from '@angular/core';
import { IDashboardWidgets, IDashboardLeads } from '@reactor-room/itopplus-model-lib';

@Component({
  selector: 'reactor-room-dashboard-leads',
  templateUrl: './dashboard-leads.component.html',
  styleUrls: ['./dashboard-leads.component.scss'],
})
export class DashboardLeadsComponent implements OnInit {
  @Input() customersData: IDashboardLeads[];
  @Input() widgetsData: IDashboardWidgets;
  followValue = 102;
  finishedValue = 101;
  sumValue = this.followValue + this.finishedValue;

  constructor() {}

  ngOnInit(): void {}
}
