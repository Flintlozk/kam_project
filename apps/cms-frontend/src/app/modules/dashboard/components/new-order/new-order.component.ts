import { Component, OnInit } from '@angular/core';
import { IHeading } from '../../../../components/heading/heading.model';

@Component({
  selector: 'cms-next-new-order',
  templateUrl: './new-order.component.html',
  styleUrls: ['./new-order.component.scss'],
})
export class NewOrderComponent implements OnInit {
  heading: IHeading = {
    title: 'New Order',
    subTitle: 'Dashboard / New Order',
  };
  constructor() {}

  ngOnInit(): void {}
}
