import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IMarketPlaceTogglerInput } from '@reactor-room/itopplus-model-lib';

@Component({
  selector: 'reactor-room-toggler',
  templateUrl: './toggler.component.html',
  styleUrls: ['./toggler.component.less'],
})
export class TogglerComponent {
  @Input() toggleInput: IMarketPlaceTogglerInput;
  @Output() toggleEvent = new EventEmitter<string>();

  onToggle(id: string) {
    this.toggleEvent.emit(id);
  }
}
