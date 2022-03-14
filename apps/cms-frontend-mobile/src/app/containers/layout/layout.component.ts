import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutService } from '../../services/layout.service';
import { RouteAnimate } from '@reactor-room/animation';
@Component({
  selector: 'cms-next-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
  animations: [RouteAnimate.routeCMSMobileAnimation],
})
export class LayoutComponent implements OnInit {
  fullLayout = false;
  noHeaderLayout = false;
  constructor(private layoutService: LayoutService) {}

  ngOnInit(): void {
    this.layoutService.sharedFullLayout.subscribe((status) => (this.fullLayout = status));
    this.layoutService.sharedNoHeaderLayout.subscribe((status) => (this.noHeaderLayout = status));
  }

  prepareRoute(outlet: RouterOutlet): RouterOutlet {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
