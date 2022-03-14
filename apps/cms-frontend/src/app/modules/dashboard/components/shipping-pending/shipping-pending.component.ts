import { Component, OnInit } from '@angular/core';
import { IHeading } from '../../../../components/heading/heading.model';

@Component({
  selector: 'cms-next-shipping-pending',
  templateUrl: './shipping-pending.component.html',
  styleUrls: ['./shipping-pending.component.scss'],
})
export class ShippingPendingComponent implements OnInit {
  heading: IHeading = {
    title: 'Shipping Pending',
    subTitle: 'Dashboard / Shipping Pending',
  };
  constructor() {}

  ngOnInit(): void {}
}
