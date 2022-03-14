import { Component, OnInit } from '@angular/core';
import { IHeading } from '../../../../components/heading/heading.model';

@Component({
  selector: 'cms-next-payment-system',
  templateUrl: './payment-system.component.html',
  styleUrls: ['./payment-system.component.scss'],
})
export class PaymentSystemComponent implements OnInit {
  heading: IHeading = {
    title: 'Payment System',
    subTitle: 'Dashboard / Payment System',
  };
  constructor() {}

  ngOnInit(): void {}
}
