import { Component, OnInit } from '@angular/core';
import { IHeading } from '../../../../components/heading/heading.model';

@Component({
  selector: 'cms-next-order-management',
  templateUrl: './order-management.component.html',
  styleUrls: ['./order-management.component.scss'],
})
export class OrderManagementComponent implements OnInit {
  heading: IHeading = {
    title: 'Order Management',
    subTitle: 'Dashboard / Order Management',
  };
  constructor() {}

  ngOnInit(): void {}
}
