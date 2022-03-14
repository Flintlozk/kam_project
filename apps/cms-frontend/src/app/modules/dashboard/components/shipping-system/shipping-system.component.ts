import { Component, OnInit } from '@angular/core';
import { IHeading } from '../../../../components/heading/heading.model';

@Component({
  selector: 'cms-next-shipping-system',
  templateUrl: './shipping-system.component.html',
  styleUrls: ['./shipping-system.component.scss'],
})
export class ShippingSystemComponent implements OnInit {
  heading: IHeading = {
    title: 'Shipping System',
    subTitle: 'Dashboard / Shipping System',
  };
  constructor() {}

  ngOnInit(): void {}
}
