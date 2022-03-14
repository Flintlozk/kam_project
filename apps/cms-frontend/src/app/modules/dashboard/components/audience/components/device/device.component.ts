import { Component, Input, OnChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DashboardWebstat } from '@reactor-room/autodigi-models-lib';
import { environmentLib } from '@reactor-room/environment-services-frontend';

@Component({
  selector: 'cms-next-device',
  templateUrl: './device.component.html',
  styleUrls: ['./device.component.scss'],
})
export class DeviceComponent implements OnChanges {
  @Input() autodigiWebstat: DashboardWebstat;
  colors: string[];
  labels: string[];
  total: number;
  data: number[];

  constructor(private translate: TranslateService) {}
  ngOnChanges(): void {
    if (this.autodigiWebstat) {
      this.labels = [this.translate.instant('Desktop'), this.translate.instant('Smart Phone'), this.translate.instant('Tablet'), this.translate.instant('Others')];
      this.colors = ['#5ECC4F', '#57585A', '#939FB8', '#EE9D3D'];
      const mobile = this.getSumOfArray(this.autodigiWebstat.visitor_total[0].mobile);
      const desktop = this.getSumOfArray(this.autodigiWebstat.visitor_total[0].desktop);
      const tablet = this.getSumOfArray(this.autodigiWebstat.visitor_total[0].tablet);
      const others = this.getSumOfArray(this.autodigiWebstat.visitor_total[0].unknown);
      this.data = [desktop, mobile, tablet, others];
      this.total = desktop + mobile + tablet + others;
    } else {
      this.labels = [this.translate.instant('Desktop'), this.translate.instant('Smart Phone'), this.translate.instant('Tablet'), this.translate.instant('Others')];
      this.colors = ['#5ECC4F', '#57585A', '#939FB8', '#EE9D3D'];
      this.data = [0, 0, 0, 0];
      this.total = 0;
    }
  }
  getSumOfArray(data: number[]): number {
    const add = (a: number, b: number) => a + b;
    return data.length > 0 ? data.reduce(add) : 0;
  }
  openAutodigi() {
    window.open(`${environmentLib.AUTODIGI_URL}/autodigi/conversion#device`);
  }
}
