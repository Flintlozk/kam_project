import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'reactor-room-previous-messages',
  templateUrl: './previous-messages.component.html',
  styleUrls: ['./previous-messages.component.scss'],
})
export class PreviousMessagesComponent {
  constructor() {}
  @Input() isRequesting: boolean;
  @Output() previousMessages: EventEmitter<boolean> = new EventEmitter<boolean>();
  getPreviousMessages(): void {
    this.previousMessages.emit(true);
  }
}
