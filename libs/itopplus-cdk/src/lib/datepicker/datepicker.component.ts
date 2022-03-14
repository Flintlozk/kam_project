import { Component, EventEmitter, Input, OnChanges, Output, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'reactor-room-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class DatepickerComponent<D> implements OnChanges {
  constructor() {}

  @Input() minDate: Date = new Date(2020, 0, 1);
  @Input() maxDate: Date = new Date();
  @Input() value: Date;
  @Output() setDate: EventEmitter<Date> = new EventEmitter<Date>();
  propValue;

  ngOnChanges(): void {
    if (this.value) {
      this.propValue = new FormControl(this.value);
    }
  }

  onDateChange(): void {
    this.setDate.emit(this.propValue.value);
  }
}
