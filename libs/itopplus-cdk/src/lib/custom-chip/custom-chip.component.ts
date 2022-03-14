import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'reactor-room-custom-chip',
  templateUrl: './custom-chip.component.html',
  styleUrls: ['./custom-chip.component.less'],
  encapsulation: ViewEncapsulation.None,
})
export class CustomChipComponent implements OnInit {
  @Input() is_readonly: boolean;
  @Input() formField: FormControl;
  @Input() inputControl: FormControl;
  constructor() {}
  ngOnInit() {}

  addItem(): void {
    const inputValue = this.formField.value;
    if (this.formField.valid && inputValue !== '') {
      this.inputControl.value.push(inputValue);
      this.inputControl.markAsDirty();
      this.formField.reset();
    }
  }
  removeItem(item): void {
    const items = this.inputControl.value;
    const positionedIndex = items.indexOf(item);
    items.splice(positionedIndex, 1);
    this.inputControl.markAsDirty();
  }
}
