import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { IDashboardAudience } from '@reactor-room/itopplus-model-lib';

@Component({
  selector: 'reactor-room-dashboard-audience',
  templateUrl: './dashboard-audience.component.html',
  styleUrls: ['./dashboard-audience.component.scss'],
})
export class DashboardAudienceComponent implements OnInit, OnChanges {
  @Input() data: IDashboardAudience[];
  @Input() isLoading: boolean;
  topPadding = '20px';
  loadingText = 'Loading...';

  constructor() {}

  ngOnInit(): void {
    if (window.innerWidth <= 768) {
      this.topPadding = '10px';
    } else this.topPadding = '20px';
  }

  ngOnChanges(changes: SimpleChanges): void {}
}
