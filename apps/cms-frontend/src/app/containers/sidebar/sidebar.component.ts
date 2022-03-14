import { Component, OnDestroy, OnInit } from '@angular/core';
import { CMSUserService, LoginService } from '@reactor-room/cms-frontend-services-lib';
import { getCookie, setCookie } from '@reactor-room/itopplus-front-end-helpers';
import { EnumAuthScope, EnumPageMemberType, IPagesContext, IPageWithStatus, IUserContext } from '@reactor-room/itopplus-model-lib';
import { of, Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'cms-next-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  theme = EnumAuthScope.CMS;
  userContext: IUserContext;
  facebookPageData: IPageWithStatus[] = [];
  pageImgUrlActive: string;
  pageTitleActive: string;
  isOwner: boolean;
  currentPageRole: EnumPageMemberType;

  destroy$: Subject<void> = new Subject<void>();

  constructor(private authService: AuthService, private userService: CMSUserService, private loginService: LoginService) {}

  ngOnInit(): void {
    this.getUserSubscriptionsContext();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  getUserSubscriptionsContext(): void {
    this.userService.$userContext
      .pipe(
        tap((res) => {
          this.userContext = res;
          this.facebookPageData = [];

          const { pages } = this.userContext;
          const currentPageIndex = Number(getCookie('page_index'));

          pages.map((item, index) => {
            const page: IPageWithStatus = {
              pageID: item.pageId,
              pageIndex: item.pageIndex,
              pageImgUrl: item.picture,
              pageTitle: item.pageName,
              pageActiveStatus: false,
              pageWizardStep: item.wizardStep,
            };

            if (index === currentPageIndex) {
              page.pageActiveStatus = true;
              this.pageImgUrlActive = page.pageImgUrl;
              this.pageTitleActive = page.pageTitle;
              this.currentPageRole = item.pageRole;
            }

            if (pages.length - 1 < currentPageIndex && index === 0) {
              page.pageActiveStatus = true;
              this.pageImgUrlActive = page.pageImgUrl;
              this.pageTitleActive = page.pageTitle;
              setCookie('page_index', 0, 30);
            }

            this.facebookPageData.push(page);
          });
        }),
      )
      .subscribe();
  }

  selectPageByIndex(page: IPagesContext): void {
    const currentIndex = Number(getCookie('page_index'));
    const index = page.pageIndex;
    if (index !== currentIndex) {
      for (let i = 0; i < this.facebookPageData.length; i++) {
        this.facebookPageData[i].pageActiveStatus = false;
      }
      this.facebookPageData[index].pageActiveStatus = true;
      this.pageImgUrlActive = this.facebookPageData[index].pageImgUrl;
      this.pageTitleActive = this.facebookPageData[index].pageTitle;
      setCookie('page_index', page.pageIndex, 30);

      of(true)
        .pipe(
          switchMap(() => {
            return this.authService.state4CheckPage(page.pageIndex);
          }),
        )
        .subscribe(); // Error already handle in -> this.authService.state4CheckPage
    }
  }

  createPage(): void {
    // TODO : Create Default page for CMSs
  }

  fetchAllPageNotification(fetch: boolean): void {
    if (fetch === true) {
      this.getAllPageNotification();
    }
  }

  getAllPageNotification(): void {
    // this.notificationService
    //   .getAllNotificationInbox()
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe((notify) => {
    //     this.facebookPageData.map((pageContext) => {
    //       const payload = notify.find((x) => pageContext.pageID === x.pageID);
    //       payload ? (pageContext.pageTotalNotify = payload.total) : (pageContext.pageTotalNotify = 0);
    //     });
    //   });
  }
}
