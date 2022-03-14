import { Component, OnInit } from '@angular/core';
import { FirstGuide } from './first-guide.model';
import { FadeAnimate } from '@reactor-room/animation';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'cms-next-first-guide',
  templateUrl: './first-guide.component.html',
  styleUrls: ['./first-guide.component.scss'],
  animations: [
    FadeAnimate.fadeBoxAnimation,
    FadeAnimate.fadeInOutYAnimation,
    trigger('iconFade', [state('true', style({ opacity: '1' })), state('false', style({ opacity: '0.25' })), transition('false <=> true', animate(500))]),
  ],
})
export class FirstGuideComponent implements OnInit {
  firstGuideStatus = false;
  currentDirection: string;
  currentLabel: string;
  currentDescription: string;
  count = 0;

  firstGuideItems = [
    {
      label: 'Dashboard',
      description: "See what's going, including daily update and still connect with your website and shop online",
      direction: 'Next',
      routeLabel: 'Home',
      routeLink: '/home',
      imgUrl: 'assets/images/footer/home.svg',
      imgActiveUrl: 'assets/images/footer/home-active.svg',
      activeStatus: true,
    },
    {
      label: 'Order',
      description: "Check your Online Shop activities list in Order Management. What's new order",
      direction: 'Next',
      routeLabel: 'Order',
      routeLink: '/order',
      imgUrl: 'assets/images/footer/order.svg',
      imgActiveUrl: 'assets/images/footer/order-active.svg',
      activeStatus: false,
    },
    {
      label: 'Content',
      description: 'Allow you to edit content on your website easily such as text and images',
      direction: 'Next',
      routeLabel: 'Content',
      routeLink: '/content',
      imgUrl: 'assets/images/footer/content.svg',
      imgActiveUrl: 'assets/images/footer/content-active.svg',
      activeStatus: false,
    },
    {
      label: 'Product',
      description: 'Update your product anytime, the things like price, stock, discount or images',
      direction: 'Next',
      routeLabel: 'Product',
      routeLink: '/product',
      imgUrl: 'assets/images/footer/product.svg',
      imgActiveUrl: 'assets/images/footer/product-active.svg',
      activeStatus: false,
    },
    {
      label: 'Profile',
      description: "Be notified when you get message on your website, you wouldn't miss every customer",
      direction: 'Done',
      routeLabel: 'Profile',
      routeLink: '/profile',
      imgUrl: 'assets/images/footer/profile.svg',
      imgActiveUrl: 'assets/images/footer/profile-active.svg',
      activeStatus: false,
    },
  ] as FirstGuide[];

  constructor() {}

  ngOnInit(): void {
    const firstGuideDate = window.localStorage.getItem('firstGuideDate');
    if (!firstGuideDate) {
      this.firstGuideStatus = true;
    }

    this.currentDirection = this.firstGuideItems[0].direction;
    this.currentLabel = this.firstGuideItems[0].label;
    this.currentDescription = this.firstGuideItems[0].description;
  }

  changeToNextGuide(): void {
    const length = this.firstGuideItems.length;
    for (let i = 0; i < length; i++) {
      this.firstGuideItems[i].activeStatus = false;
    }
    if (this.count < length - 1) {
      this.count++;
      this.currentDirection = this.firstGuideItems[this.count]?.direction;
      this.currentLabel = this.firstGuideItems[this.count]?.label;
      this.currentDescription = this.firstGuideItems[this.count]?.description;
      this.firstGuideItems[this.count].activeStatus = true;
    } else {
      this.dismissGuide();
    }
  }

  changeToGuide(index: number): void {
    const length = this.firstGuideItems.length;
    for (let i = 0; i < length; i++) {
      this.firstGuideItems[i].activeStatus = false;
    }
    this.currentDirection = this.firstGuideItems[index]?.direction;
    this.currentLabel = this.firstGuideItems[index]?.label;
    this.currentDescription = this.firstGuideItems[index]?.description;
    this.firstGuideItems[index].activeStatus = true;
    this.count = index;
  }

  dismissGuide(): void {
    this.firstGuideStatus = false;
    const date = new Date();
    window.localStorage.setItem('firstGuideDate', date.toDateString());
  }

  trackByIndex(index: number): number {
    return index;
  }
}
