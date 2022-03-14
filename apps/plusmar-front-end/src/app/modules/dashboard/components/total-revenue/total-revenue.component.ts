import { Component, OnInit, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'reactor-room-total-revenue',
  templateUrl: './total-revenue.component.html',
  styleUrls: ['./total-revenue.component.scss'],
})
export class TotalRevenueComponent implements OnInit {
  constructor(translate: TranslateService) {}

  @Input() total;
  ngOnInit(): void {}
}
