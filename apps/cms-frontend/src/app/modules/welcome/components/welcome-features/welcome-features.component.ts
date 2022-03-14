import { Component, OnInit } from '@angular/core';
import { IWelcomeFeature } from './welcome-features.model';

@Component({
  selector: 'cms-next-welcome-features',
  templateUrl: './welcome-features.component.html',
  styleUrls: ['./welcome-features.component.scss'],
})
export class WelcomeFeaturesComponent implements OnInit {
  features: IWelcomeFeature[] = [
    {
      icon: 'assets/features/shop.svg',
      title: 'Shop',
      subTitle: 'Information',
    },
    {
      icon: 'assets/features/product.svg',
      title: 'Product',
      subTitle: 'Management',
    },
    {
      icon: 'assets/features/order.svg',
      title: 'Order',
      subTitle: 'Management',
    },
    {
      icon: 'assets/features/shipping.svg',
      title: 'Shipping',
      subTitle: 'System',
    },
    {
      icon: 'assets/features/payment.svg',
      title: 'Payment',
      subTitle: 'System',
    },
    {
      icon: 'assets/features/promotion.svg',
      title: 'Promotion',
      subTitle: '',
    },
    {
      icon: 'assets/features/sale.svg',
      title: 'Sale',
      subTitle: 'Channel',
    },
  ];
  constructor() {}

  ngOnInit(): void {}

  trackByIndex(index: number): number {
    return index;
  }
}
