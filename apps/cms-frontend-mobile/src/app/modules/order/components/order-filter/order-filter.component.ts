import { Component, OnInit } from '@angular/core';
import { FadeAnimate } from '@reactor-room/animation';

@Component({
  selector: 'cms-next-order-filter',
  templateUrl: './order-filter.component.html',
  styleUrls: ['./order-filter.component.scss'],
  animations: [FadeAnimate.iconFade],
})
export class OrderFilterComponent implements OnInit {
  tabOrderData = [
    {
      title: 'New',
      imgUrl: '/assets/images/order/new.svg',
      imgActiveUrl: '/assets/images/order/new-active.svg',
      value: '230',
      routeLink: '/order/new',
    },
    {
      title: 'Payment',
      imgUrl: '/assets/images/order/payment.svg',
      imgActiveUrl: '/assets/images/order/payment-active.svg',
      value: '230',
      routeLink: '/order/payment',
    },
    {
      title: 'Shipping',
      imgUrl: '/assets/images/order/shipping.svg',
      imgActiveUrl: '/assets/images/order/shipping-active.svg',
      value: '230',
      routeLink: '/order/shipping',
    },
    {
      title: 'Finish',
      imgUrl: '/assets/images/order/finish.svg',
      imgActiveUrl: '/assets/images/order/finish-active.svg',
      value: '230',
      routeLink: '/order/finish',
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  trackByIndex(index: number): number {
    return index;
  }
}
