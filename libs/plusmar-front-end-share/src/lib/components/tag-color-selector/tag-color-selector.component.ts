import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ColorCodeEmitter, IKeyValuePair } from '@reactor-room/model-lib';
import { CUSTOMER_TAG_COLOR } from '@reactor-room/itopplus-model-lib';

@Component({
  selector: 'reactor-room-tag-color-selector',
  templateUrl: './tag-color-selector.component.html',
  styleUrls: ['./tag-color-selector.component.scss'],
})
export class TagColorSelectorComponent implements OnInit {
  tagColorEnum = CUSTOMER_TAG_COLOR;
  tagColorArray = [] as IKeyValuePair[];
  @Input() currentIndex = 0;
  @Input() defaultColorSelected: string;
  @Output() selectedColorCode: EventEmitter<ColorCodeEmitter> = new EventEmitter<ColorCodeEmitter>();
  constructor() {}

  ngOnInit(): void {
    this.getTagColors();
    this.setDefaultColor();
  }

  setDefaultColor(): void {
    if (this.defaultColorSelected) {
      this.setColorSelected(this.defaultColorSelected);
    }
  }

  selectColorCode(colorCode: IKeyValuePair): void {
    this.disableAllColorFlags();
    const colorKey = colorCode.key as string;
    this.setColorSelected(colorKey);
    this.sendColorCode(colorCode);
  }

  setColorSelected(colorKey: string): void {
    if (colorKey) {
      const selectedColor = this.tagColorArray?.find((color) => color.key === colorKey);
      selectedColor.displaySelected = true;
    }
  }

  sendColorCode(colorCode: IKeyValuePair): void {
    this.selectedColorCode.emit({ colorCode, currentIndex: this.currentIndex });
  }

  disableAllColorFlags(): void {
    this.tagColorArray?.map((item) => (item.displaySelected = false));
  }

  getTagColors(): void {
    for (const key in this.tagColorEnum) {
      if (Object.prototype.hasOwnProperty.call(this.tagColorEnum, key)) {
        const obj: IKeyValuePair = {
          key,
          value: this.tagColorEnum[key],
          displaySelected: false,
        };
        this.tagColorArray.push(obj);
      }
    }
  }
}
