import { Component, HostListener, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { inputOnlyNumber } from '@reactor-room/itopplus-front-end-helpers';

@Component({
  selector: 'reactor-room-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss'],
})
export class TimepickerComponent implements OnInit {
  @Input() timeForm: FormGroup;
  //
  @Input() isCustom: boolean;
  @Input() max: number;
  @Input() min: number;
  @Input() selector: string;
  @Input() isNumber = false;

  @Input() customID1 = '';
  @Input() customID2 = '';

  constructor() {}

  ngOnInit(): void {}

  isNumberKey(evt: KeyboardEvent): boolean {
    return inputOnlyNumber(evt);
  }
  isMoreThanLength(evt: KeyboardEvent, type?: string): boolean {
    const currentValue = this.timeForm.controls[this.selector].value;
    if (!this.isCustom) {
      const min = 0;
      const max = type === 'hour' ? 24 : 59;
      if (currentValue > max) {
        this.timeForm.controls[this.selector].setValue(this.setValue(max));
      } else if (currentValue < min) {
        this.timeForm.controls[this.selector].setValue(this.setValue(min));
      }
    } else {
      if (currentValue > this.max) {
        this.timeForm.controls[this.selector].setValue(this.setValue(this.max));
      } else if (currentValue < this.min) {
        this.timeForm.controls[this.selector].setValue(this.setValue(this.min));
      }
    }
    return true;
  }

  onScrollTimer(event: WheelEvent, type?: string /* hour,minute */): void {
    event.preventDefault();
    const isScrollUp = event.deltaY <= 0;

    if (!this.isCustom) {
      const min = 0;
      const max = type === 'hour' ? 24 : 59;
      const currentValue = Number(this.timeForm.controls[type].value) as number;

      const newValue = isScrollUp ? currentValue + 1 : currentValue - 1;
      if (newValue > max) this.timeForm.controls[type].setValue(this.setValue(min));
      else if (newValue < min) this.timeForm.controls[type].setValue(this.setValue(max));
      else this.timeForm.controls[type].setValue(this.setValue(newValue));
    } else {
      const currentValue = Number(this.timeForm.controls[this.selector].value) as number;
      const newValue = isScrollUp ? currentValue + 1 : currentValue - 1;
      if (newValue > this.max) this.timeForm.controls[this.selector].setValue(this.setValue(this.min));
      else if (newValue < this.min) this.timeForm.controls[this.selector].setValue(this.setValue(this.max));
      else this.timeForm.controls[this.selector].setValue(this.setValue(newValue));
    }
    this.timeForm.markAsDirty();
  }

  setValue(value: string | number): string | number {
    if (this.isNumber) return Number(value);
    else return String(value).padStart(2, '0');
  }
}
