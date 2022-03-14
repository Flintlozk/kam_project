import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouteAnimate } from '@reactor-room/animation';

@Component({
  selector: 'cms-next-cms',
  templateUrl: './cms.component.html',
  styleUrls: ['./cms.component.scss'],
  animations: [RouteAnimate.routeCMSAnimation],
})
export class CmsComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}

  prepareRoute(outlet: RouterOutlet): RouterOutlet {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
