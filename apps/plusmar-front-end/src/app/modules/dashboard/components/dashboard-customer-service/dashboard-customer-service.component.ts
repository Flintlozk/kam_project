import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'reactor-room-dashboard-customer-service',
  templateUrl: './dashboard-customer-service.component.html',
  styleUrls: ['./dashboard-customer-service.component.scss'],
})
export class DashboardCustomerServiceComponent implements OnInit {
  @Input() businessDashboard = false;

  valuePercentage: { label: string; value: number; colorCode: string; percent: string }[] = [
    { label: this.translate.instant('Open'), value: 102, colorCode: '#C7D8E9', percent: null },
    { label: this.translate.instant('In progress'), value: 104, colorCode: '#FBB936', percent: null },
    { label: this.translate.instant('Done'), value: 202, colorCode: '#54B1FF', percent: null },
    { label: this.translate.instant('Reject'), value: 30, colorCode: '#EB6160', percent: null },
  ];
  sumValue: number;

  constructor(public translate: TranslateService) {}

  ngOnInit(): void {
    this.percentGeneration();
  }

  percentGeneration() {
    let sum = 0;
    this.valuePercentage.forEach((item) => (sum += item.value));
    for (const i of this.valuePercentage) {
      i.percent = (i.value / sum).toFixed(2);
    }
    this.sumValue = sum;
  }
}
