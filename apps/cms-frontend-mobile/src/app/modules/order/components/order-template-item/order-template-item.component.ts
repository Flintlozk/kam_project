import { Component, Input, OnInit } from '@angular/core';
import { ScaleAnimate } from '@reactor-room/animation';

@Component({
  selector: 'cms-next-order-template-item',
  templateUrl: './order-template-item.component.html',
  styleUrls: ['./order-template-item.component.scss'],
  animations: [ScaleAnimate.scaleYAnimation],
})
export class OrderTemplateItemComponent implements OnInit {
  @Input() imgUrl: string;
  @Input() fullName: string;
  @Input() orderCode: string;
  @Input() hhmm: string;

  contentToggleStatus = false;

  constructor() {}

  ngOnInit(): void {}

  toggleContent(): void {
    this.contentToggleStatus = !this.contentToggleStatus;
  }
}
