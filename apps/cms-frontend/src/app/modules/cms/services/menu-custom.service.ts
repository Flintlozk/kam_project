import { Injectable, OnDestroy } from '@angular/core';
import {
  IWebPageFromToContainer,
  IWebPageOrderNumber,
  IUpdateWebPageHomePage,
  IUpdateWebPagesHide,
  IWebPage,
  IWebPagePage,
  IWebPageDetails,
  IMenuGroup,
} from '@reactor-room/cms-models-lib';
import { IHTTPResult } from '@reactor-room/model-lib';
import { Apollo } from 'apollo-angular';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import {
  CREATE_MENU_PAGE,
  REMOVE_MENU_PAGE_FROM_CONTAINER,
  UPDATE_MENU_PAGE_DETAILS,
  UPDATE_MENU_PAGE_FROM_TO_CONTAINER,
  UPDATE_MENU_PAGE_NAME,
  UPDATE_MENU_PAGE_HIDE,
  UPDATE_MENU_PAGE_HOMEPAGE,
  UPDATE_MENU_PAGE_ORDER_NUMBERS,
  GET_MENU_PAGE_BY_MENU_PAGE_ID,
  GET_MENU_GROUP,
  GET_PAGES_BY_PAGE_ID,
} from './cms-query/menu-custom.query';

@Injectable({
  providedIn: 'root',
})
export class CmsMenuCustomService implements OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private apollo: Apollo) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  createMenuPage(level: number, page: IWebPagePage, menuGroupId: string): Observable<IWebPagePage> {
    return this.apollo
      .mutate({
        mutation: CREATE_MENU_PAGE,
        fetchPolicy: 'no-cache',
        variables: { level, page, menuGroupId },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['createMenuPage']),
      );
  }

  updateMenuPageDetails(_id: string, pageDetails: IWebPageDetails, menuGroupId: string): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: UPDATE_MENU_PAGE_DETAILS,
        fetchPolicy: 'no-cache',
        variables: { _id, pageDetails, menuGroupId },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updateMenuPageDetails']),
      );
  }

  updateMenuPageHomepage(updateMenuPageHomePage: IUpdateWebPageHomePage, menuGroupId: string): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: UPDATE_MENU_PAGE_HOMEPAGE,
        fetchPolicy: 'no-cache',
        variables: { updateMenuPageHomePage, menuGroupId },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updateMenuPageHomepage']),
      );
  }

  updateMenuPageName(name: string, level: number, _id: string, menuGroupId: string): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: UPDATE_MENU_PAGE_NAME,
        fetchPolicy: 'no-cache',
        variables: { name, level, _id, menuGroupId },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updateMenuPageName']),
      );
  }

  updateMenuPagesHide(updateMenuPagesHide: IUpdateWebPagesHide[], isHide: boolean, menuGroupId: string): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: UPDATE_MENU_PAGE_HIDE,
        fetchPolicy: 'no-cache',
        variables: { updateMenuPagesHide, isHide, menuGroupId },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updateMenuPagesHide']),
      );
  }

  updateMenuPageOrderNumbers(menuPageOrderNumbers: IWebPageOrderNumber[], menuGroupId: string): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: UPDATE_MENU_PAGE_ORDER_NUMBERS,
        fetchPolicy: 'no-cache',
        variables: { menuPageOrderNumbers, menuGroupId },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updateMenuPageOrderNumbers']),
      );
  }

  updateMenuPageFromToContainer(
    previousMenuPagePositions: IWebPageFromToContainer[],
    nextMenuPagePositions: IWebPageFromToContainer[],
    oldMenuPageOrderNumbers: IWebPageOrderNumber[],
    newMenuPageOrderNumbers: IWebPageOrderNumber[],
    menuGroupId: string,
  ): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: UPDATE_MENU_PAGE_FROM_TO_CONTAINER,
        fetchPolicy: 'no-cache',
        variables: { previousMenuPagePositions, nextMenuPagePositions, oldMenuPageOrderNumbers, newMenuPageOrderNumbers, menuGroupId },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updateMenuPageFromToContainer']),
      );
  }

  removeMenuPageFromContainer(menuPagePositions: IWebPageFromToContainer[], menuPageOrderNumbers: IWebPageOrderNumber[], menuGroupId: string): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: REMOVE_MENU_PAGE_FROM_CONTAINER,
        fetchPolicy: 'no-cache',
        variables: { menuPagePositions, menuPageOrderNumbers, menuGroupId },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['removeMenuPageFromContainer']),
      );
  }

  getMenuGroup(): Observable<IMenuGroup[]> {
    return this.apollo
      .query({
        query: GET_MENU_GROUP,
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getMenuGroup']),
      );
  }

  getMenuPageByMenuPageID(_id: string, menuGroupId: string): Observable<IWebPagePage> {
    return this.apollo
      .query({
        query: GET_MENU_PAGE_BY_MENU_PAGE_ID,
        fetchPolicy: 'no-cache',
        variables: { _id, menuGroupId },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getMenuPageByMenuPageID']),
      );
  }

  getMenuPagesByPageID(menuGroupId: string): Observable<IWebPage[]> {
    return this.apollo
      .query({
        query: GET_PAGES_BY_PAGE_ID,
        fetchPolicy: 'no-cache',
        variables: { menuGroupId },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getMenuPagesByPageID']),
      );
  }
}
