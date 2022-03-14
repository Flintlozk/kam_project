import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'reactor-room-customer-service',
  templateUrl: './customer-service.component.html',
  styleUrls: ['./customer-service.component.scss'],
})
export class CustomerServiceComponent implements OnInit {
  steps = [
    { label: 'Step 1', text: this.translate.instant('Issues'), total: 20, image: 'assets/img/icon_next.svg', route: 'issues' },
    { label: 'Step 2', text: this.translate.instant('Closed'), total: 3, image: 'assets/img/step-icon-close-sales.svg', route: 'closed' },
  ];

  constructor(public translate: TranslateService) {}

  ngOnInit(): void {}
}
