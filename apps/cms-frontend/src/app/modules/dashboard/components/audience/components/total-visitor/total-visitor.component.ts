import { Component, Input, OnChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DashboardWebstat } from '@reactor-room/autodigi-models-lib';
import { environmentLib } from '@reactor-room/environment-services-frontend';

@Component({
  selector: 'cms-next-total-visitor',
  templateUrl: './total-visitor.component.html',
  styleUrls: ['./total-visitor.component.scss'],
})
export class TotalVisitorComponent implements OnChanges {
  @Input() autodigiWebstat: DashboardWebstat;
  labels: string[];
  colors: string[];
  data: number[];
  total: number;

  constructor(private translate: TranslateService) {}
  ngOnChanges(): void {
    if (this.autodigiWebstat) {
      const oldData = this.getSumOfArray(this.autodigiWebstat.visitor_total[0].return);
      const newData = this.getSumOfArray(this.autodigiWebstat.visitor_total[0].new);
      this.labels = [this.translate.instant('New User'), this.translate.instant('Returning User')];
      this.colors = ['#5ECC4F', '#57585A'];
      this.total = oldData + newData;
      this.data = [oldData, newData];
    } else {
      this.labels = [this.translate.instant('New User'), this.translate.instant('Returning User')];
      this.colors = ['#5ECC4F', '#57585A'];
      this.data = [0, 0];
      this.total = 0;
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
