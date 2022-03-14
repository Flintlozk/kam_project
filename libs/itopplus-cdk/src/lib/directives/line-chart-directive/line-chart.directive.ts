import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
import { Chart } from 'chart.js';
import * as dayjs from 'dayjs';
import { TranslateService } from '@ngx-translate/core';

@Directive({
  selector: '[reactorRoomLineChart]',
})
export class LineChartDirective implements OnChanges {
  @Input() linechartData;
  @Input() linechartLabel;
  @Input() lineChartTitle = 'Customers';
  @Input() borderColor = '#54B1FF';
  @Input() linechartXKey: string;
  @Input() linechartYKey: string;
  lineChartCtx;

  customersPerDay;
  constructor(private myElement: ElementRef, public translate: TranslateService) {}
  initialized;

  getChart(ctx): Chart {
    this.lineChartCtx = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.linechartLabel,
        datasets: [
          {
            borderColor: this.borderColor,
            borderWidth: 1.3,
            tension: 0,
            pointBackgroundColor: this.borderColor,
            fill: false,
            data: this.customersPerDay,
            label: this.lineChartTitle ? this.translate.instant(this.lineChartTitle) : '',
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
            backgroundColor: '#F0F2F6',
            borderWidth: 0,
            titleColor: '#484B51',
            titleFont: {
              family: "'Prompt-Light', 'Prompt Light', 'Prompt', sans-serif",
              style: 'normal',
            },
            bodyColor: '#484B51',
            bodyFont: {
              family: "'Prompt-Light', 'Prompt Light', 'Prompt', sans-serif",
              style: 'normal',
            },
            caretSize: 8,
            padding: {
              left: 13,
              right: 13,
              top: 10,
              bottom: 10,
            },
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 0,
        },
        scales: {
          x: {
            grid: {
              color: '#EEF1F8',
              drawTicks: false,
            },
            ticks: {
              padding: 10,
            },
          },
          y: {
            grid: {
              color: '#EEF1F8',
              drawTicks: false,
            },
            ticks: {
              callback: (value) => {
                if (Number.isInteger(value as number) && Number(value) > 0) {
                  return value;
                }
              },
              padding: 10,
            },
          },
        },
      },
    });
    return this.lineChartCtx;
  }

  ngOnChanges(e): void {
    if (e?.linechartData?.currentValue?.length && this.linechartData.length) {
      if (this.lineChartCtx) this.lineChartCtx.destroy();
      const ctx = this.myElement.nativeElement.getContext('2d');
      this.linechartLabel = this.linechartData?.map((item) => dayjs(item[this.linechartXKey]).format('DD/MM'));
      this.customersPerDay = this.linechartData?.map((item) => item[this.linechartYKey]);
      this.initialized = this.getChart(ctx);
    }
  }
}
