import { ChangeDetectorRef, Component, OnInit, AfterContentChecked } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { RouteLinkEnum } from '@reactor-room/cms-models-lib';
import { TranslateService } from '@ngx-translate/core';
import { RouteAnimate } from '@reactor-room/animation';
import { LayoutService } from './services/layout.service';

@Component({
  selector: 'cms-next-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [RouteAnimate.routeCMSMobileAnimation],
})
export class AppComponent implements OnInit, AfterContentChecked {
  plainLayout = false;
  fullLayout = false;
  noHeaderLayout = false;
  constructor(private router: Router, private translate: TranslateService, private cdref: ChangeDetectorRef, private layoutService: LayoutService) {
    this.listenerIgnoreLayout(router);
    this.handleLanuages(this.translate);
  }

  ngOnInit(): void {}

  ngAfterContentChecked(): void {
    this.cdref.detectChanges();
  }
  handleLanuages(translate: TranslateService): void {
    const lang = localStorage.getItem('language') || translate.getBrowserLang() || 'en';
    translate.setDefaultLang(lang);
    translate.use(lang);
  }
  prepareRoute(outlet: RouterOutlet): RouterOutlet {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData['animation'];
  }

  listenerIgnoreLayout(router: Router): void {
    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const { href } = window.location;
        const loginPage = href.includes(RouteLinkEnum.LOGIN);
        const forgetPage = href.includes(RouteLinkEnum.FORGET);
        const draftNew = href.includes(RouteLinkEnum.CONTENT_DRAFT_NEW);
        const draftEdit = href.includes(RouteLinkEnum.CONTENT_DRAFT_EDIT);
        const contentEdit = href.includes(RouteLinkEnum.CONTENT_CONTENT_EDIT);
        const fileManageDetail = href.includes(RouteLinkEnum.CONTENT_FILE_MANAGE_DETAIL);
        const profile = href.includes(RouteLinkEnum.PROFILE);
        const productDetails = href.includes(RouteLinkEnum.PRODUCT_DETAILS);

        this.plainLayout = loginPage || forgetPage;
        this.fullLayout = draftNew || draftEdit;
        this.noHeaderLayout = contentEdit || fileManageDetail || profile || productDetails;
        this.layoutService.updatePlainLayout(this.fullLayout);
        this.layoutService.updateNoHeaderLayout(this.noHeaderLayout);
      }
    });
  }
}
