import { Component, HostListener, OnInit } from '@angular/core';
import { IHomeSliderModel } from '@reactor-room/cms-models-lib';

@Component({
  selector: 'cms-next-home-slider',
  templateUrl: './home-slider.component.html',
  styleUrls: ['./home-slider.component.scss'],
})
export class HomeSliderComponent implements OnInit {
  homeSliderData = [
    {
      title: 'New Order',
      subTitle: 'E-Commerce',
      value: '29',
      imgUrl: '/assets/images/home/new-order.svg',
      labelStyle: 'new',
      labelContent: 'New',
      routeLink: '/',
    },
    {
      title: 'Confirm Pending',
      subTitle: 'E-Commerce',
      value: '29',
      imgUrl: '/assets/images/home/confirm-pending.svg',
      labelStyle: 'new',
      labelContent: 'New',
      routeLink: '/',
    },
    {
      title: 'Shipping Pending',
      subTitle: 'E-Commerce',
      value: '29',
      imgUrl: '/assets/images/home/shipping-pending.svg',
      labelStyle: null,
      labelContent: null,
      routeLink: '/',
    },
    {
      title: 'Finish Order',
      subTitle: 'E-Commerce',
      value: '29',
      imgUrl: '/assets/images/home/finish-order.svg',
      labelStyle: 'new',
      labelContent: 'New',
      routeLink: '/',
    },
    {
      title: 'Low Stock',
      subTitle: 'E-Commerce',
      value: '29',
      imgUrl: '/assets/images/home/low-stock.svg',
      labelStyle: 'update',
      labelContent: 'Update',
      routeLink: '/',
    },
    {
      title: 'Active User',
      subTitle: 'E-Commerce',
      value: '29',
      imgUrl: '/assets/images/home/active-user.svg',
      labelStyle: 'active',
      labelContent: 'Active',
      routeLink: '/',
    },
  ] as IHomeSliderModel[];

  constructor() {}

  ngOnInit(): void {
    const homeSliderContainer = document.getElementById('home-slider') as HTMLElement;
    homeSliderContainer.style.maxWidth = window.innerWidth + 'px';
  }

  @HostListener('window:resize', ['$event.target'])
  onResize(event: Window): void {
    const homeSliderContainer = document.getElementById('home-slider') as HTMLElement;
    homeSliderContainer.style.maxWidth = event.innerWidth + 'px';
  }

  onSelectHomeSliderItem(index: number): void {
    const itemIndex = document.getElementById('homeSliderDataItemIndex' + index) as HTMLElement;
    const homeSliderContainer = document.getElementById('home-slider') as HTMLElement;
    if (homeSliderContainer) homeSliderContainer.scrollLeft = itemIndex.offsetLeft - 60;
  }
  trackByIndex(index: number): number {
    return index;
  }
}
