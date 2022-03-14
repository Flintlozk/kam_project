import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FadeAnimate } from '@reactor-room/animation';

@Component({
  selector: 'cms-next-option-toggle-layout',
  templateUrl: './option-toggle-layout.component.html',
  styleUrls: ['./option-toggle-layout.component.scss'],
  animations: [FadeAnimate.fadeInOutYDownAnimation],
})
export class OptionToggleLayoutComponent implements OnInit {
  @Input() optionToggleLayoutStatus: boolean;
  @Output() optionToggleLayoutStatusEvent = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {}

  onOutsideOptionToggleLayout(event: boolean): void {
    if (event) {
      this.optionToggleLayoutStatus = false;
      this.optionToggleLayoutStatusEvent.emit(false);
    }
  }

  onDismissOptionToggleLayout(): void {
    this.optionToggleLayoutStatus = false;
    this.optionToggleLayoutStatusEvent.emit(false);
  }
}
