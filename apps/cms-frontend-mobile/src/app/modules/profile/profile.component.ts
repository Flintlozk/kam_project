import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouteAnimate, FadeAnimate } from '@reactor-room/animation';

@Component({
  selector: 'cms-next-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [FadeAnimate.iconFade, RouteAnimate.routeCMSMobileAnimation],
})
export class ProfileComponent implements OnInit {
  profileData = {
    profileImage: null,
    profileTitle: "Powell's book store",
    profileEmail: 'powellsbookstore@gmail.com',
  };

  profileRoutingData = [
    {
      title: 'Notification',
      imgUrl: '/assets/images/profile/notification.svg',
      imgUrlActive: '/assets/images/profile/notification_active.svg',
      routeLink: '/profile/notification',
      hasNotification: true,
    },
    {
      title: 'Setting',
      imgUrl: '/assets/images/profile/setting.svg',
      imgUrlActive: '/assets/images/profile/setting_active.svg',
      routeLink: '/profile/setting',
      hasNotification: false,
    },
    {
      title: 'Help',
      imgUrl: '/assets/images/profile/help.svg',
      imgUrlActive: '/assets/images/profile/help_active.svg',
      routeLink: '/profile/help',
      hasNotification: false,
    },
    {
      title: 'Logout',
      imgUrl: '/assets/images/profile/logout.svg',
      imgUrlActive: '/assets/images/profile/logout_active.svg',
      routeLink: '/profile/logout',
      hasNotification: false,
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  prepareRoute(outlet: RouterOutlet): RouterOutlet {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
  trackByIndex(index: number): number {
    return index;
  }
}
