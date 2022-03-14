import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { RouteAnimate } from '@reactor-room/animation';
import { RouteLinkCmsEnum } from '@reactor-room/cms-models-lib';
import { StatusSnackbarComponent, StatusSnackbarModel, StatusSnackbarType } from '@reactor-room/itopplus-cdk';
import { EMPTY, Subject } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { SettingWebsiteService } from '../../services/setting-webiste.service';
import { IWelcomeTab } from './welcome.model';
@Component({
  selector: 'cms-next-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  animations: [RouteAnimate.routeCMSAnimation],
})
export class WelcomeComponent implements OnInit, AfterViewInit, OnDestroy {
  isStyled = false;
  destroy$ = new Subject();
  nextRoute: string;
  welcomeTab: IWelcomeTab[] = [
    {
      route: RouteLinkCmsEnum.WELCOME_INTRO,
      styled: true,
      nextRoute: RouteLinkCmsEnum.WELCOME_FEATURES,
    },
    {
      route: RouteLinkCmsEnum.WELCOME_FEATURES,
      styled: false,
      nextRoute: RouteLinkCmsEnum.WELCOME_TEMPLATES,
    },
    {
      route: RouteLinkCmsEnum.WELCOME_TEMPLATES,
      styled: false,
      nextRoute: '/' + RouteLinkCmsEnum.DASHBOARD,
    },
  ];
  constructor(private router: Router, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.onWelComeInit();
  }

  onWelComeInit(): void {}

  ngAfterViewInit(): void {
    this.listenerIgnoreLayout(this.router);
    const lastUrl = this.router.url.split('/')[2];
    this.isStyled = this.getWelcomeStyled(lastUrl);
    this.nextRoute = this.getToNextRoute(lastUrl);
  }

  showUnexpectedError(): void {
    this.snackBar.openFromComponent(StatusSnackbarComponent, {
      data: {
        type: StatusSnackbarType.ERROR,
        message: 'Unexpected Error occured...Try again later!',
      } as StatusSnackbarModel,
    });
  }

  prepareRoute(outlet: RouterOutlet): RouterOutlet {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  listenerIgnoreLayout(router: Router): void {
    router.events.pipe(takeUntil(this.destroy$)).subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const lastUrl = event.url.split('/')[2];
        this.isStyled = this.getWelcomeStyled(lastUrl);
        this.nextRoute = this.getToNextRoute(lastUrl);
      }
    });
  }
  getWelcomeStyled(url: string): boolean {
    let foundItem = null;
    this.welcomeTab.forEach((item) => {
      if (url.includes(item.route)) foundItem = item;
    });
    return foundItem.styled;
  }

  getToNextRoute(url: string): string {
    let foundItem = null;
    this.welcomeTab.forEach((item) => {
      if (url.includes(item.route)) foundItem = item;
    });
    return foundItem.nextRoute;
  }

  trackByIndex(index: number): number {
    return index;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
