import { Component, OnInit } from '@angular/core';
import { IHeading } from '../../../../components/heading/heading.model';

@Component({
  selector: 'cms-next-product-management',
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.scss'],
})
export class ProductManagementComponent implements OnInit {
  heading: IHeading = {
    title: 'Product Management',
    subTitle: 'Dashboard / Product Management',
  };
  constructor() {}

  ngOnInit(): void {}
}
