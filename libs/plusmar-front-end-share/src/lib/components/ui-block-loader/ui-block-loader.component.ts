import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'reactor-room-ui-block-loader',
  templateUrl: './ui-block-loader.component.html',
  styleUrls: ['./ui-block-loader.component.scss'],
})
export class UiBlockLoaderComponent implements OnChanges {
  @Input() toggle = false;
  constructor() {}

  ngOnChanges(): void {}
}
