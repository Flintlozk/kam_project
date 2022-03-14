import { Component, Input, OnChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DashboardWebstat } from '@reactor-room/autodigi-models-lib';
import { environmentLib } from '@reactor-room/environment-services-frontend';

@Component({
  selector: 'cms-next-traffic-source',
  templateUrl: './traffic-source.component.html',
  styleUrls: ['./traffic-source.component.scss'],
})
export class TrafficSourceComponent implements OnChanges {
  @Input() autodigiWebstat: DashboardWebstat;
  labels: string[];
  colors: string[];
  data: number[];

  constructor(private translate: TranslateService) {}
  ngOnChanges(): void {
    if (this.autodigiWebstat) {
      this.labels = [
        this.translate.instant('Google (Ads)'),
        this.translate.instant('Google (SEO)'),
        this.translate.instant('Social'),
        this.translate.instant('Direct'),
        this.translate.instant('Referral'),
      ];
      this.colors = ['#5ECC4F', '#57585A', '#939FB8', '#ED9D3D', '#3E8A26'];
      const paidSearch = this.getSumOfArray(this.autodigiWebstat.visitor_gateway[0].googleads);
      const organicSearch = this.getSumOfArray(this.autodigiWebstat.visitor_gateway[0].google);
      const social = this.getSumOfArray(this.autodigiWebstat.visitor_gateway[0].social);
      const direct = this.getSumOfArray(this.autodigiWebstat.visitor_gateway[0].direct);
      const referral = this.getSumOfArray(this.autodigiWebstat.visitor_gateway[0].link);
      this.data = [paidSearch, organicSearch, social, direct, referral];
    } else {
      this.labels = [
        this.translate.instant('Google (Ads)'),
        this.translate.instant('Google (SEO)'),
        this.translate.instant('Social'),
        this.translate.instant('Direct'),
        this.translate.instant('Referral'),
      ];
      this.colors = ['#5ECC4F', '#57585A', '#939FB8', '#ED9D3D', '#3E8A26'];
      this.data = [0, 0, 0, 0, 0];
    }
  }
  getSumOfArray(data: number[]): number {
    const add = (a: number, b: number) => a + b;
    return data.length > 0 ? data.reduce(add) : 0;
  }

  openAutodigi() {
    window.open(`${environmentLib.AUTODIGI_URL}/autodigi/conversion#visitor`);
  }
}
