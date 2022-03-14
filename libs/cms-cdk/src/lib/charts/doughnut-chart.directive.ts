import { Directive, ElementRef, Input, OnChanges } from '@angular/core';
import { Chart } from 'chart.js';

@Directive({
  selector: '[cmsNextDoughnutChart]',
})
export class DoughnutChartDirective implements OnChanges {
  constructor(private myElement: ElementRef) {}
  @Input() labels = [] as string[];
  @Input() data = [] as number[];
  @Input() colors = [] as string[];

  initialized: Chart;

  getChart(ctx: HTMLCanvasElement): Chart {
    return new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: this.labels,
        datasets: [
          {
            data: this.data,
            backgroundColor: this.colors,
            borderColor: '#000',
            // fill: false,
            borderWidth: 0,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
          },
          tooltip: {
            enabled: true,
          },
        },
        cutout: 75,
        responsive: true,
        maintainAspectRatio: false,
      },
    });
  }

  ngOnChanges(): void {
    const dataInputArray: number[] = [this.colors?.length, this.data?.length, this.labels?.length];
    const isDataInputEquals = new Set(dataInputArray).size === 1;
    if (!isDataInputEquals) throw new Error('Data, label and color inputs are not equal');
    this.initialized?.destroy();
    const ctx = this.myElement.nativeElement.getContext('2d');
    this.initialized = this.getChart(ctx);
  }
}
