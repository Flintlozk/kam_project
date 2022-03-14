import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { IAudienceWithCustomer, IHistoriesPipeline } from '@reactor-room/itopplus-model-lib';

@Component({
  selector: 'reactor-room-history-pipeline',
  templateUrl: './history-pipeline.component.html',
  styleUrls: ['./history-pipeline.component.scss'],
})
export class HistoryPipelineComponent implements OnInit, OnChanges {
  @Input() historyData = [] as IAudienceWithCustomer[];
  histories: IHistoriesPipeline[];

  colors = [
    '#f2f5f9',
    '#fde8bd',
    '#c8e5fe',
    '#fde7dd',
    '#d7f6da',
    '#f2f5f9',
    '#fde8bd',
    '#c8e5fe',
    '#fde7dd',
    '#d7f6da',
    '#f2f5f9',
    '#fde8bd',
    '#c8e5fe',
    '#fde7dd',
    '#d7f6da',
    '#f2f5f9',
    '#fde8bd',
    '#c8e5fe',
    '#fde7dd',
    '#d7f6da',
  ];

  constructor() {}

  ngOnInit(): void {
    this.mapColors(this.historyData);
  }

  ngOnChanges(): void {
    this.mapColors(this.historyData);
  }

  mapColors(histories): void {
    this.histories = histories.reverse().map((history, index) => {
      let startColor = this.colors[0 + index - 1] || 'white';
      let endColor = this.colors[0 + index] || 'white';

      if (history.previous_status === 'REJECT') {
        startColor = '#f9813d';
      } else if (history.previous_status === 'CLOSED') {
        startColor = '#2ec639';
      }

      if (history.status === 'REJECT') {
        endColor = '#f9813d';
      } else if (history.status === 'CLOSED') {
        endColor = '#2ec639';
      }

      return { ...history, startColor, endColor } as IHistoriesPipeline;
    });
    this.histories = this.histories.reverse();
  }
}
