import { Component, OnInit } from '@angular/core';
import { IFooterModel } from '@reactor-room/cms-models-lib';
import { FadeAnimate } from '@reactor-room/animation';

@Component({
  selector: 'cms-next-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  animations: [FadeAnimate.fadeBoxAnimation, FadeAnimate.fadeInOutYAnimation, FadeAnimate.iconFade],
})
export class FooterComponent implements OnInit {
  constructor() {}

  footerItems = [
    {
      label: 'Home',
      routerLink: '/home',
      imgUrl: 'assets/images/footer/home.svg',
      imgActiveUrl: 'assets/images/footer/home-active.svg',
    },
    {
      label: 'Order',
      routerLink: '/order',
      imgUrl: 'assets/images/footer/order.svg',
      imgActiveUrl: 'assets/images/footer/order-active.svg',
    },
    {
      label: 'Content',
      routerLink: '/content',
      imgUrl: 'assets/images/footer/content.svg',
      imgActiveUrl: 'assets/images/footer/content-active.svg',
    },
    {
      label: 'Product',
      routerLink: '/product',
      imgUrl: 'assets/images/footer/product.svg',
      imgActiveUrl: 'assets/images/footer/product-active.svg',
    },
    {
      label: 'Profile',
      routerLink: '/profile',
      imgUrl: 'assets/images/footer/profile.svg',
      imgActiveUrl: 'assets/images/footer/profile-active.svg',
    },
  ] as IFooterModel[];

  ngOnInit(): void {}

  trackByIndex(index: number): number {
    return index;
  }
}
