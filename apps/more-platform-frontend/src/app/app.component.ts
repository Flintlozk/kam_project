import { ChangeDetectorRef, Component, AfterContentChecked } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { LayoutService } from './services/layout.service';
import { RouteAnimate } from '@reactor-room/animation';
import { RouteLinkEnum } from './shares/route.model';

@Component({
  selector: 'more-platform-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [RouteAnimate.routeMoreAnimation],
})
export class AppComponent implements AfterContentChecked {
  fullLayout = false;

  constructor(private router: Router, private layoutService: LayoutService, private cdref: ChangeDetectorRef) {
    this.listenerIgnoreLayout(this.router);
  }

  ngAfterContentChecked(): void {
    this.cdref.detectChanges();
  }

  prepareRoute(outlet: RouterOutlet): RouterOutlet {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  listenerIgnoreLayout(router: Router): void {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const { href } = window.location;
        const isLoginRoute = href.includes(RouteLinkEnum.LOGIN);
        const isRegisterRoute = href.includes(RouteLinkEnum.REGISTER);
        const isForgetPasswordRoute = href.includes(RouteLinkEnum.FORGET_PASSWORD);
        this.fullLayout = isLoginRoute || isRegisterRoute || isForgetPasswordRoute;
        this.layoutService.updateFullLayout(this.fullLayout);
      }
    });
  }
}
