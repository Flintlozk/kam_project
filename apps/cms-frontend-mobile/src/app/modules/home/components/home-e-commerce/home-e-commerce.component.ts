import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cms-next-home-e-commerce',
  templateUrl: './home-e-commerce.component.html',
  styleUrls: ['./home-e-commerce.component.scss'],
})
export class HomeECommerceComponent implements OnInit {
  eCommerceData = [
    {
      imgUrl: '/assets/images/home/transection.svg',
      title: 'Transaction (Order)',
      value: 190,
      status: 'positive',
      statusValue: 5.86,
    },
    {
      imgUrl: '/assets/images/home/revenue.svg',
      title: 'Revenue',
      value: 33434,
      status: 'negative',
      statusValue: 5.86,
    },
    {
      imgUrl: '/assets/images/home/profit.svg',
      title: 'Profit',
      value: 21748,
      status: 'neutral',
      statusValue: 5.86,
    },
  ];

  constructor() {}

  ngOnInit(): void {}
  trackByIndex(index: number): number {
    return index;
  }
}
