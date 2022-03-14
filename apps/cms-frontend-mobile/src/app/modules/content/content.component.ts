import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouteAnimate } from '@reactor-room/animation';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'cms-next-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.less'],
  animations: [RouteAnimate.routeCMSMobileAnimation],
})
export class ContentComponent implements OnInit {
  fullLayout = false;
  noHeaderlayout = false;
  constructor(private layoutService: LayoutService) {}

  ngOnInit(): void {
    this.layoutService.sharedFullLayout.subscribe((status) => (this.fullLayout = status));
    this.layoutService.sharedNoHeaderLayout.subscribe((status) => (this.noHeaderlayout = status));
  }

  prepareRoute(outlet: RouterOutlet): RouterOutlet {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }
}
