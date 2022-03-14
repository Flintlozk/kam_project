import { IHeading } from '../../../../components/heading/heading.model';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cms-next-finish-order',
  templateUrl: './finish-order.component.html',
  styleUrls: ['./finish-order.component.scss'],
})
export class FinishOrderComponent implements OnInit {
  heading: IHeading = {
    title: 'Finish Order',
    subTitle: 'Dashboard / Finish Order',
  };
  constructor() {}

  ngOnInit(): void {}
}
