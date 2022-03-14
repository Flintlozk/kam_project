import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouteAnimate } from '@reactor-room/animation';

@Component({
  selector: 'cms-next-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
  animations: [RouteAnimate.routeCMSMobileAnimation],
})
export class OrderComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  prepareRoute(outlet: RouterOutlet): RouterOutlet {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
