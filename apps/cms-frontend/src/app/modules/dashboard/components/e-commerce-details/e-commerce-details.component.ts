import { Component, OnInit } from '@angular/core';
import { IHeading } from '../../../../components/heading/heading.model';

@Component({
  selector: 'cms-next-e-commerce-details',
  templateUrl: './e-commerce-details.component.html',
  styleUrls: ['./e-commerce-details.component.scss'],
})
export class ECommerceDetailsComponent implements OnInit {
  heading: IHeading = {
    title: 'E-Commerce',
    subTitle: 'Dashboard / E-Commerce',
  };
  constructor() {}

  ngOnInit(): void {}
}
