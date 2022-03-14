import { Injectable, OnDestroy } from '@angular/core';
import {
  IWebPageFromToContainer,
  IWebPageOrderNumber,
  IUpdateWebPageHomePage,
  IUpdateWebPagesHide,
  IWebPage,
  IWebPagePage,
  IWebPageDetails,
  IMenuHTML,
  IMenuCssJs,
} from '@reactor-room/cms-models-lib';
import { IHTTPResult } from '@reactor-room/model-lib';
import { Apollo } from 'apollo-angular';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import {
  CREATE_WEB_PAGE,
  GET_HOMEPAGE_ID,
  GET_LANDING_WEB_PAGE_BY_NAME,
  GET_MENU_CSS_JS,
  GET_MENU_HTML,
  GET_PAGES_BY_PAGE_ID,
  GET_WEB_PAGE_BY_WEB_PAGE_ID,
  REMOVE_WEB_PAGE_FROM_CONTAINER,
  UPDATE_WEB_PAGE_DETAILS,
  UPDATE_WEB_PAGE_FROM_TO_CONTAINER,
  UPDATE_WEB_PAGE_HIDE,
  UPDATE_WEB_PAGE_HOMEPAGE,
  UPDATE_WEB_PAGE_NAME,
  UPDATE_WEB_PAGE_ORDER_NUMBERS,
} from './cms-query/cms-site-menu-page.query';

@Injectable({
  providedIn: 'root',
})
export class CmsSiteMenuPageService implements OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  AllPage$ = new ReplaySubject<IWebPage[]>();
  currentPage$ = new ReplaySubject<IWebPagePage>();
  constructor(private apollo: Apollo) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  createWebPage(level: number, page: IWebPagePage): Observable<IWebPagePage> {
    return this.apollo
      .mutate({
        mutation: CREATE_WEB_PAGE,
        fetchPolicy: 'no-cache',
        variables: { level, page },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['createWebPage']),
      );
  }

  removeWebPageFromContainer(webPagePositions: IWebPageFromToContainer[], webPageOrderNumbers: IWebPageOrderNumber[]): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: REMOVE_WEB_PAGE_FROM_CONTAINER,
        fetchPolicy: 'no-cache',
        variables: { webPagePositions, webPageOrderNumbers },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['removeWebPageFromContainer']),
      );
  }

  updateWebPageDetails(_id: string, pageDetails: IWebPageDetails): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: UPDATE_WEB_PAGE_DETAILS,
        fetchPolicy: 'no-cache',
        variables: { _id, pageDetails },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updateWebPageDetails']),
      );
  }

  updateWebPageFromToContainer(
    previousWebPagePositions: IWebPageFromToContainer[],
    nextWebPagePositions: IWebPageFromToContainer[],
    oldWebPageOrderNumbers: IWebPageOrderNumber[],
    newWebPageOrderNumbers: IWebPageOrderNumber[],
  ): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: UPDATE_WEB_PAGE_FROM_TO_CONTAINER,
        fetchPolicy: 'no-cache',
        variables: { previousWebPagePositions, nextWebPagePositions, oldWebPageOrderNumbers, newWebPageOrderNumbers },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updateWebPageFromToContainer']),
      );
  }

  updateWebPageName(name: string, level: number, _id: string): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: UPDATE_WEB_PAGE_NAME,
        fetchPolicy: 'no-cache',
        variables: { name, level, _id },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updateWebPageName']),
      );
  }

  updateWebPagesHide(updateWebPagesHide: IUpdateWebPagesHide[], isHide: boolean): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: UPDATE_WEB_PAGE_HIDE,
        fetchPolicy: 'no-cache',
        variables: { updateWebPagesHide, isHide },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updateWebPagesHide']),
      );
  }

  updateWebPageHomepage(updateWebPageHomePage: IUpdateWebPageHomePage): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: UPDATE_WEB_PAGE_HOMEPAGE,
        fetchPolicy: 'no-cache',
        variables: { updateWebPageHomePage },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updateWebPageHomepage']),
      );
  }

  updateWebPageOrderNumbers(webPageOrderNumbers: IWebPageOrderNumber[]): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: UPDATE_WEB_PAGE_ORDER_NUMBERS,
        fetchPolicy: 'no-cache',
        variables: { webPageOrderNumbers },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updateWebPageOrderNumbers']),
      );
  }

  getWebPageByWebPageID(_id: string): Observable<IWebPagePage> {
    return this.apollo
      .query({
        query: GET_WEB_PAGE_BY_WEB_PAGE_ID,
        fetchPolicy: 'no-cache',
        variables: { _id },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getWebPageByWebPageID']),
      );
  }

  getWebPagesByPageID(): Observable<IWebPage[]> {
    return this.apollo
      .query({
        query: GET_PAGES_BY_PAGE_ID,
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getWebPagesByPageID']),
      );
  }

  getMenuHTML(menuHTML: IMenuHTML): Observable<string> {
    return this.apollo
      .query({
        query: GET_MENU_HTML,
        fetchPolicy: 'no-cache',
        variables: { menuHTML },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getMenuHTML']),
      );
  }

  getMenuCssJs(webPageID: string, _id: string, isFromTheme: boolean): Observable<IMenuCssJs> {
    return this.apollo
      .query({
        query: GET_MENU_CSS_JS,
        fetchPolicy: 'no-cache',
        variables: { webPageID, _id, isFromTheme },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getMenuCssJs']),
      );
  }
  getHomePageId(): Observable<IHTTPResult> {
    return this.apollo
      .query({
        query: GET_HOMEPAGE_ID,
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getHomePageId']),
      );
  }

  getLandingWebPageByName(previousWebPageID: string, componentId: string): Observable<IWebPagePage> {
    return this.apollo
      .query({
        query: GET_LANDING_WEB_PAGE_BY_NAME,
        fetchPolicy: 'no-cache',
        variables: { previousWebPageID, componentId },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getLandingWebPageByName']),
      );
  }
}
