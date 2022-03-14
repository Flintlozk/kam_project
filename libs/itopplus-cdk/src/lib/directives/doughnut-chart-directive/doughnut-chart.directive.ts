import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
import { Chart } from 'chart.js';
import { TranslateService } from '@ngx-translate/core';

@Directive({
  selector: '[reactorRoomDoughnutChart]',
})
export class DoughnutChartDirective implements OnChanges {
  constructor(private myElement: ElementRef, public translate: TranslateService) {}
  @Input() firstLabel = 'First Data';
  @Input() secondLabel = 'Second Data';
  @Input() mainColor = '#5EB9FF';
  @Input() secondColor = '#A7DAFE';
  @Input() firstData;
  @Input() secondData;
  initialized;

  getChart(ctx): Chart {
    return new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [this.firstLabel ? this.translate.instant(this.firstLabel) : '', this.secondLabel ? this.translate.instant(this.secondLabel) : ''],
        datasets: [
          {
            data: [...([this.firstData] || []), ...([this.secondData] || [])],
            backgroundColor: [this.mainColor, this.secondColor],
            // fill: false,
            borderWidth: 0,
          },
        ],
      },

      options: {
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            enabled: true,
          },
        },
        cutout: 65,
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }

  ngOnChanges(e): void {
    this.initialized?.destroy();
    const ctx = this.myElement.nativeElement.getContext('2d');
    this.initialized = this.getChart(ctx);
  }
}
