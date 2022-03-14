import { Component, Input, OnChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DashboardWebstat } from '@reactor-room/autodigi-models-lib';
import { environmentLib } from '@reactor-room/environment-services-frontend';

@Component({
  selector: 'cms-next-widget-click',
  templateUrl: './widget-click.component.html',
  styleUrls: ['./widget-click.component.scss'],
})
export class WidgetClickComponent implements OnChanges {
  @Input() autodigiWebstat: DashboardWebstat;
  labels: string[];
  colors: string[];
  data: number[];
  total: number;

  constructor(private translate: TranslateService) {}
  ngOnChanges(): void {
    if (this.autodigiWebstat) {
      this.labels = [
        this.translate.instant('Call'),
        this.translate.instant('Line'),
        this.translate.instant('Messenger'),
        this.translate.instant('Form'),
        this.translate.instant('Map'),
      ];
      this.colors = ['#57585B', '#06C755', '#0083FE', '#EE9D3D', '#D73F35'];
      const call = this.getSumOfArray(this.autodigiWebstat.click[0].call);
      const line = this.getSumOfArray(this.autodigiWebstat.click[0].line);
      const messenger = this.getSumOfArray(this.autodigiWebstat.click[0].messenger);
      const form = this.getSumOfArray(this.autodigiWebstat.click[0].form);
      const location = this.getSumOfArray(this.autodigiWebstat.click[0].location);
      this.data = [call, line, messenger, form, location];
      this.total = call + line + messenger + form + location;
    } else {
      this.labels = [
        this.translate.instant('Call'),
        this.translate.instant('Line'),
        this.translate.instant('Messenger'),
        this.translate.instant('Form'),
        this.translate.instant('Map'),
      ];
      this.colors = ['#57585B', '#06C755', '#0083FE', '#EE9D3D', '#D73F35'];
      this.data = [0, 0, 0, 0, 0];
      this.total = 0;
    }
  }
  getSumOfArray(data: number[]): number {
    const add = (a: number, b: number) => a + b;
    return data.length > 0 ? data.reduce(add) : 0;
  }

  openAutodigi() {
    window.open(`${environmentLib.AUTODIGI_URL}/autodigi/conversion#click`);
  }
}
