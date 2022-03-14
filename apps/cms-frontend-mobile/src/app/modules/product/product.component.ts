import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RouteAnimate } from '@reactor-room/animation';
import { LayoutService } from '../../services/layout.service';

@Component({
  selector: 'cms-next-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
  animations: [RouteAnimate.routeCMSMobileAnimation],
})
export class ProductComponent implements OnInit {
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
