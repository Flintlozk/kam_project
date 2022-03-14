import { Component, OnInit } from '@angular/core';
import { FadeAnimate } from '@reactor-room/animation';
import { IWelcomeMenu } from './welcome-header.model';

@Component({
  selector: 'more-platform-welcome-header',
  templateUrl: './welcome-header.component.html',
  styleUrls: ['./welcome-header.component.scss'],
  animations: [FadeAnimate.fadeBoxAnimation, FadeAnimate.fadeInOutXAnimation],
})
export class WelcomeHeaderComponent implements OnInit {
  welcomeMenuData = [
    {
      title: 'Menu 1',
      routeLink: '323',
      subMenuStatus: false,
      subMenu: [
        {
          title: 'Menu 1, 1',
          route: '3232',
        },
        {
          title: 'Menu 1, 2',
          route: '23',
        },
      ],
    },
    {
      title: 'Menu 2',
      route: '333',
      subMenuStatus: false,
      subMenu: [],
    },
    {
      title: 'Menu 3',
      route: 'dsa',
      subMenuStatus: false,
      subMenu: [],
    },
  ] as IWelcomeMenu[];

  hamburgerStatus = false;

  constructor() {}

  ngOnInit(): void {}

  onToggleHambugerStatus(): void {
    this.hamburgerStatus = !this.hamburgerStatus;
  }

  trackByIndex(index: number): number {
    return index;
  }

  onWelcomeMenuDataItem(index: number): void {
    this.welcomeMenuData[index].subMenuStatus = !this.welcomeMenuData[index].subMenuStatus;
  }

  onOutsideWelcomeMenuDataItem(event: boolean, index: number): void {
    if (event) {
      this.welcomeMenuData[index].subMenuStatus = false;
    }
  }
}
