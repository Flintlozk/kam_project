import { Component, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { deepCopy } from '@reactor-room/itopplus-front-end-helpers';
import { EMPTY, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { EDropPostion, ICmsSite, ISiteDropInfo } from '../../cms-site-menu.model';
import { FadeAnimate } from '@reactor-room/animation';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogModel, ConfirmDialogType } from '../../../../../../components/dialog-theme/confirm-dialog/confirm-dialog.model';
import { ConfirmDialogComponent } from '../../../../../../components/dialog-theme/confirm-dialog/confirm-dialog.component';
import { StatusSnackbarComponent } from '@reactor-room/itopplus-cdk';
import { StatusSnackbarModel, StatusSnackbarType } from '@reactor-room/itopplus-cdk';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DOCUMENT } from '@angular/common';
import { CdkDragDrop, CdkDragMove } from '@angular/cdk/drag-drop';
import { CmsSidebarService } from '../../../../services/cms-sidebar.service';
import { IWebPagePage, IWebPage, IWebPageOrderNumber, IWebPageFromToContainer, IUpdateWebPageHomePage, IUpdateWebPagesHide, RouteLinkEnum } from '@reactor-room/cms-models-lib';
import { CmsSiteMenuPageService } from '../../../../services/cms-site-menu-page.service';
import { isEqual, sortBy } from 'lodash';
import { SiteOptionActionTypes } from './cms-site-menu-option/cms-site-menu-option.model';
import { ESidebarMode } from '../../../../containers/cms-sidebar/cms-sidebar.model';
import { IHTTPResult } from '@reactor-room/model-lib';
import { Router } from '@angular/router';
import { WebsiteService } from '../../../../services/website.service';
import { CmsCommonService } from '../../../../services/cms-common.service';
import { CmsMenuCustomService } from '../../../../services/menu-custom.service';

@Component({
  selector: 'cms-next-cms-site-menu-page',
  templateUrl: './cms-site-menu-page.component.html',
  styleUrls: ['./cms-site-menu-page.component.scss'],
  animations: [FadeAnimate.fadeBoxAnimation],
})
export class CmsSiteMenuPageComponent implements OnInit, OnChanges, OnDestroy {
  cmsWebPagesData: IWebPage[] = [];
  cmsSites: ICmsSite[] = [];
  previousWebPagePositions: IWebPageFromToContainer[] = [];
  nextWebPagePositions: IWebPageFromToContainer[] = [];
  webPagePositions: IWebPageFromToContainer[] = [];
  updateWebPagesHide: IUpdateWebPagesHide[] = [];
  previousActiveSite: ICmsSite;
  previousChildSelectedSite: ICmsSite;
  currentHomeSite: ICmsSite;
  cmsStoredSites = deepCopy<ICmsSite[]>(this.cmsSites);
  currentCmsSiteFilter: string;
  destroy$ = new Subject();
  searchForm: FormGroup;
  newPageForm: FormGroup;
  renameForm: FormGroup;
  RouteLinkEnum = RouteLinkEnum;
  createNewPageStatus = false;
  createNewPageFromChildStatus = false;
  renameStatus = false;
  maximumNestedLevel = 4;
  dropTargetIds = [];
  nodeLookup = {};
  dropActionTodo: ISiteDropInfo = null;
  dropEvent$ = new Subject();
  debounceFunc$ = new Subject();
  cmsIdArray: string[] = [];
  currentSite: IWebPagePage;
  homePageWebPage: IWebPagePage;
  @Input() isFromMegaChild = false;
  @Input() menuGroupId: string;
  @Input() parentMenuId: string;
  @Output() parentMenuIdEvent = new EventEmitter<string>();

  constructor(
    private sidebar: CmsSidebarService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private siteMenuPageService: CmsSiteMenuPageService,
    private menuCustomService: CmsMenuCustomService,
    private sidebarService: CmsSidebarService,
    private websiteService: WebsiteService,
    private cmsCommonService: CmsCommonService,
    private router: Router,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  ngOnInit(): void {
    this.searchForm = this.getSearchFormGroup();
    this.newPageForm = this.getNewPageFormGroup();
    this.renameForm = this.getRenameFormGroup();
    this.onPageFilterSearch();
    this.drop();
    const isCustomMenu = this.menuGroupId;
    isCustomMenu ? this.onGetMenuPagesByPageID() : this.onGetPagesByPageID();
    this.sidebar.getCreatePageStatus.pipe(takeUntil(this.destroy$)).subscribe((result) => (this.createNewPageStatus = result));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.menuGroupId?.currentValue) {
      this.onGetMenuPagesByPageID();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  trackByIndex(index: number): number {
    return index;
  }

  trackBySiteId(i: number, site: ICmsSite): string {
    return site.siteId;
  }

  onGetPagesByPageID(): void {
    this.siteMenuPageService.currentPage$
      .pipe(
        tap((result: IWebPagePage) => {
          this.currentSite = result;
        }),
        takeUntil(this.destroy$),
        switchMap(() => {
          return EMPTY;
        }),
        catchError((e) => {
          this.showUnexpectedError();
          console.log('e => onGetPagesByPageID :>> ', e);
          return EMPTY;
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
    this.siteMenuPageService.AllPage$.pipe(
      take(1),
      tap((result: IWebPage[]) => {
        this.cmsWebPagesData = result;
        this.convertCmsWebPagesDataToCmsSitesFormat();
        this.prepareDragDrop(this.cmsSites);
        this.setCmsArrayIds(this.cmsSites);
        this.getSiteHomepage(this.cmsSites);
        if (this.nodeLookup[this.parentMenuId]) this.nodeLookup[this.parentMenuId].isChildSelected = true;
      }),
      catchError((e) => {
        this.showUnexpectedError();
        console.log('e => onGetPagesByPageID :>> ', e);
        return EMPTY;
      }),
      takeUntil(this.destroy$),
    ).subscribe();
  }

  onGetMenuPagesByPageID(): void {
    this.menuCustomService
      .getMenuPagesByPageID(this.menuGroupId)
      .pipe(
        tap((result: IWebPage[]) => {
          if (result?.length) {
            this.cmsWebPagesData = result;
            this.convertCmsWebPagesDataToCmsSitesFormat();
            this.prepareDragDrop(this.cmsSites);
            this.setCmsArrayIds(this.cmsSites);
            this.getSiteHomepage(this.cmsSites);
          }
        }),
        catchError((e) => {
          this.showUnexpectedError();
          console.log('e => onGetMenuPagesByPageID :>> ', e);
          return EMPTY;
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  convertCmsWebPagesDataToCmsSitesFormat(): void {
    this.cmsSites = [];
    const parentSites = this.cmsWebPagesData.find((webPage) => webPage.level === 1);
    this.translatorCmsWebPagesDataToCmsSites(this.cmsSites, parentSites.pages, 1);
    this.calculateCmsSitesNestedLevel(this.cmsSites);
  }

  translatorCmsWebPagesDataToCmsSites(sites: ICmsSite[], parentPages: IWebPagePage[], pageLevel: number): void {
    const sortPagesByOrderNumber = sortBy(parentPages, ['orderNumber']);
    sortPagesByOrderNumber.forEach((parentPage: IWebPagePage, index: number) => {
      const siteTempItem: ICmsSite = {
        title: parentPage.name,
        isHide: parentPage.isHide,
        isDraggable: true,
        isHomePage: parentPage.isHomepage,
        currentLevel: pageLevel,
        nestedLevel: 1,
        siteId: parentPage._id,
        child: [],
        isToggleStatus: false,
        parentId: parentPage.parentID ? parentPage.parentID : 'main',
        isActive: false,
      };
      if (parentPage.isHomepage) {
        this.homePageWebPage = parentPage;
        this.currentHomeSite = siteTempItem;
      }
      sites.push(siteTempItem);
      const newLevelWebPages = this.cmsWebPagesData.find((webPage) => webPage.level === pageLevel + 1);
      if (newLevelWebPages) {
        const newParentPages = newLevelWebPages.pages.filter((page) => page.parentID === parentPage._id);
        if (newParentPages.length) this.translatorCmsWebPagesDataToCmsSites(sites[index].child, newParentPages, pageLevel + 1);
      }
    });
  }

  calculateCmsSitesNestedLevel(sites: ICmsSite[]): void {
    sites.forEach((site) => {
      site.nestedLevel = this.getNestedOfObject(site);
      if (site.child.length) {
        this.calculateCmsSitesNestedLevel(site.child);
      }
    });
  }

  getNestedOfObject(site: ICmsSite): number {
    let depth = 0;
    if (site.child) {
      site.child.forEach((childSite) => {
        const tmpDepth = this.getNestedOfObject(childSite);
        if (tmpDepth > depth) {
          depth = tmpDepth;
        }
      });
    }
    return 1 + depth;
  }

  prepareDragDrop(cmsSites: ICmsSite[]): void {
    cmsSites.forEach((node: ICmsSite) => {
      this.dropTargetIds.push(node.siteId);
      this.nodeLookup[node.siteId] = node;
      this.prepareDragDrop(node.child);
    });
  }

  setCmsArrayIds(cmsSites: ICmsSite[]): void {
    cmsSites.forEach((node: ICmsSite) => {
      this.cmsIdArray.push(node.siteId);
      this.setCmsArrayIds(node.child);
    });
  }

  dragMoved(event: CdkDragMove): void {
    const e = document.elementFromPoint(event.pointerPosition.x, event.pointerPosition.y);
    if (!e) {
      this.clearDragInfo();
      return;
    }
    const container = e.classList.contains('node-item') ? e : e.closest('.node-item');
    if (!container) {
      this.clearDragInfo();
      return;
    }
    this.dropActionTodo = {
      targetId: container.getAttribute('data-id'),
    };
    const targetLevel = +container.getAttribute('data-level');
    const dragElement = event.source.element.nativeElement.firstChild as HTMLElement;
    const dragNestedLevel = +dragElement.getAttribute('data-nested-level');
    const targetRect = container.getBoundingClientRect();
    const oneThird = targetRect.height / 3;
    if (event.pointerPosition.y - targetRect.top < oneThird) {
      if (targetLevel + dragNestedLevel > this.maximumNestedLevel + 1) {
        this.dropActionTodo['action'] = EDropPostion.BEFORE_MAX_LEVEL;
      } else {
        this.dropActionTodo['action'] = EDropPostion.BEFORE;
      }
    } else if (event.pointerPosition.y - targetRect.top > 2 * oneThird) {
      if (targetLevel + dragNestedLevel > this.maximumNestedLevel + 1) {
        this.dropActionTodo['action'] = EDropPostion.AFTER_MAX_LEVEL;
      } else {
        this.dropActionTodo['action'] = EDropPostion.AFTER;
      }
    } else {
      if (targetLevel + dragNestedLevel > this.maximumNestedLevel) {
        this.dropActionTodo['action'] = EDropPostion.INSIDE_MAX_LEVEL;
      } else {
        this.dropActionTodo['action'] = EDropPostion.INSIDE;
      }
    }
    this.showDragInfo();
  }

  getHomeId(): string {
    const found = this.cmsSites.find((site) => site.isHomePage === true);
    return found?.siteId;
  }

  drop(): void {
    this.dropEvent$.pipe(takeUntil(this.destroy$)).subscribe((event: CdkDragDrop<ICmsSite[]>) => {
      if (!this.dropActionTodo || !this.isDropAvailable()) {
        this.clearDragInfo(true);
        return;
      }
      const draggedItemId = event.item.data;
      const parentItemId = event.previousContainer.id;
      const targetListId = this.getParentNodeId(this.dropActionTodo.targetId, this.cmsSites, 'main');
      const draggedItem = this.nodeLookup[draggedItemId];
      const oldItemContainer = parentItemId !== 'main' ? this.nodeLookup[parentItemId].child : this.cmsSites;
      const newContainer = targetListId !== 'main' ? this.nodeLookup[targetListId].child : this.cmsSites;
      const i = oldItemContainer.findIndex((c: ICmsSite) => c.siteId === draggedItemId);
      const targetIndex = newContainer.findIndex((c: ICmsSite) => c.siteId === this.dropActionTodo.targetId);
      //const dragElement = document.getElementById(`node-${draggedItem.siteId}`) as HTMLElement;
      const previousDragItem = deepCopy<ICmsSite>(draggedItem);
      switch (this.dropActionTodo.action) {
        case EDropPostion.BEFORE:
          oldItemContainer.splice(i, 1);
          newContainer.splice(targetIndex, 0, draggedItem);
          setTimeout(() => {
            const dragElement = document.getElementById(`node-${draggedItem.siteId}`) as HTMLElement;
            this.updateDragItemAttribute(dragElement, draggedItem);
            this.updateNestedParentLevel();
            if (draggedItem.parentId !== parentItemId) {
              this.updateWebPageFromToContainerHandler(previousDragItem, draggedItem, oldItemContainer, newContainer);
            } else {
              this.updateSitesOrderNumber(newContainer);
            }
          }, 0);
          break;
        case EDropPostion.AFTER:
          oldItemContainer.splice(i, 1);
          newContainer.splice(targetIndex + 1, 0, draggedItem);
          setTimeout(() => {
            const dragElement = document.getElementById(`node-${draggedItem.siteId}`) as HTMLElement;
            this.updateDragItemAttribute(dragElement, draggedItem);
            this.updateNestedParentLevel();
            if (draggedItem.parentId !== parentItemId) {
              this.updateWebPageFromToContainerHandler(previousDragItem, draggedItem, oldItemContainer, newContainer);
            } else {
              this.updateSitesOrderNumber(newContainer);
            }
          }, 0);
          break;
        case EDropPostion.INSIDE:
          oldItemContainer.splice(i, 1);
          this.nodeLookup[this.dropActionTodo.targetId].child.push(draggedItem);
          this.nodeLookup[this.dropActionTodo.targetId].isToggleStatus = true;
          setTimeout(() => {
            const dragElement = document.getElementById(`node-${draggedItem.siteId}`) as HTMLElement;
            this.updateDragItemAttribute(dragElement, draggedItem);
            this.updateNestedParentLevel();
            if (draggedItem.parentId !== parentItemId) {
              this.updateWebPageFromToContainerHandler(previousDragItem, draggedItem, oldItemContainer, newContainer);
            } else {
              this.updateSitesOrderNumber(newContainer);
            }
          }, 0);
          break;
        case EDropPostion.INSIDE_MAX_LEVEL:
        case EDropPostion.AFTER_MAX_LEVEL:
        case EDropPostion.BEFORE_MAX_LEVEL:
          this.snackBar.openFromComponent(StatusSnackbarComponent, {
            data: {
              type: StatusSnackbarType.WARNING,
              message: `Site cannot be more than ${this.maximumNestedLevel} nested levels!`,
            } as StatusSnackbarModel,
          });
          break;
      }
      this.clearDragInfo(true);
    });
  }

  updateWebPageFromToContainerHandler(previousDragItem: ICmsSite, nextDragItem: ICmsSite, oldContainer: ICmsSite[], newContainer: ICmsSite[]): void {
    this.updateSitePositions(previousDragItem, 'previous');
    this.updateSitePositions(nextDragItem, 'next');
    const oldWebPageOrderNumbers = this.getSiteOrderNumbers(oldContainer);
    const newWebPageOrderNumbers = this.getSiteOrderNumbers(newContainer);
    const isCustomMenu = this.menuGroupId;
    if (isCustomMenu) {
      this.menuCustomService
        .updateMenuPageFromToContainer(this.previousWebPagePositions, this.nextWebPagePositions, oldWebPageOrderNumbers, newWebPageOrderNumbers, this.menuGroupId)
        .pipe(
          tap((result) => {
            if (result?.status !== 200) {
              this.snackBar.openFromComponent(StatusSnackbarComponent, {
                data: {
                  type: StatusSnackbarType.ERROR,
                  message: `${result?.value}`,
                } as StatusSnackbarModel,
              });
              this.onGetPagesByPageID();
            } else {
              this.websiteService.$triggerMenuHTML.next(null);
            }
          }),
          catchError((e) => {
            this.showUnexpectedError();
            console.log('e => updateWebPageFromToContainerHandler :>> ', e);
            return EMPTY;
          }),
          takeUntil(this.destroy$),
        )
        .subscribe();
    } else {
      this.siteMenuPageService
        .updateWebPageFromToContainer(this.previousWebPagePositions, this.nextWebPagePositions, oldWebPageOrderNumbers, newWebPageOrderNumbers)
        .pipe(
          tap((result) => {
            if (result?.status !== 200) {
              this.snackBar.openFromComponent(StatusSnackbarComponent, {
                data: {
                  type: StatusSnackbarType.ERROR,
                  message: `${result?.value}`,
                } as StatusSnackbarModel,
              });
              this.onGetPagesByPageID();
            } else {
              this.websiteService.$triggerMenuHTML.next(null);
            }
          }),
          catchError((e) => {
            this.showUnexpectedError();
            console.log('e => updateWebPageFromToContainerHandler :>> ', e);
            return EMPTY;
          }),
          takeUntil(this.destroy$),
        )
        .subscribe();
    }
  }

  getSiteOrderNumbers(container: ICmsSite[]): IWebPageOrderNumber[] {
    const webPageOrderNumbers = container?.map((item) => ({
      level: item.currentLevel,
      _id: item.siteId,
      orderNumber: this.getItemIndexOfContainer(item.siteId, container),
    }));
    return webPageOrderNumbers;
  }

  updateSitePositions(dragItem: ICmsSite, key: string): void {
    switch (key) {
      case 'previous':
        {
          this.previousWebPagePositions = [];
          this.previousWebPagePositions.push({
            _id: dragItem.siteId,
            parentID: dragItem.parentId === 'main' ? null : dragItem.parentId,
            level: dragItem.currentLevel,
          });
          if (dragItem.child.length) this.updateSiteChildPositions(dragItem.child, 'previous');
        }
        break;
      case 'next':
        {
          this.nextWebPagePositions = [];
          this.nextWebPagePositions.push({
            _id: dragItem.siteId,
            parentID: dragItem.parentId === 'main' ? null : dragItem.parentId,
            level: dragItem.currentLevel,
          });
          if (dragItem.child.length) this.updateSiteChildPositions(dragItem.child, 'next');
        }
        break;
      default:
        {
          this.webPagePositions = [];
          this.webPagePositions.push({
            _id: dragItem.siteId,
            parentID: dragItem.parentId === 'main' ? null : dragItem.parentId,
            level: dragItem.currentLevel,
          });
          if (dragItem.child.length) this.updateSiteChildPositions(dragItem.child, null);
        }
        break;
    }
  }

  updateSiteChildPositions(childSites: ICmsSite[], key: string): void {
    childSites.forEach((childSite) => {
      switch (key) {
        case 'previous':
          this.previousWebPagePositions.push({
            _id: childSite.siteId,
            parentID: childSite.parentId === 'main' ? null : childSite.parentId,
            level: childSite.currentLevel,
          });
          break;
        case 'next':
          this.nextWebPagePositions.push({
            _id: childSite.siteId,
            parentID: childSite.parentId === 'main' ? null : childSite.parentId,
            level: childSite.currentLevel,
          });
          break;
        default:
          this.webPagePositions.push({
            _id: childSite.siteId,
            parentID: childSite.parentId === 'main' ? null : childSite.parentId,
            level: childSite.currentLevel,
          });
          break;
      }
      this.updateSiteChildPositions(childSite.child, key);
    });
  }

  updateSitesOrderNumber(container: ICmsSite[]): void {
    const webPageOrderNumbers = this.getSiteOrderNumbers(container);
    const isCustomMenu = this.menuGroupId;
    if (isCustomMenu) {
      this.menuCustomService
        .updateMenuPageOrderNumbers(webPageOrderNumbers, this.menuGroupId)
        .pipe(
          tap((result) => {
            if (result?.status !== 200) {
              this.onGetPagesByPageID();
              this.snackBar.openFromComponent(StatusSnackbarComponent, {
                data: {
                  type: StatusSnackbarType.ERROR,
                  message: `${result?.value}`,
                } as StatusSnackbarModel,
              });
            } else {
              this.websiteService.$triggerMenuHTML.next(null);
            }
          }),
          catchError((e) => {
            console.log('e => updateWebPageOrderNumbers :>> ', e);
            this.showUnexpectedError();
            return EMPTY;
          }),
          takeUntil(this.destroy$),
        )
        .subscribe();
    } else {
      this.siteMenuPageService
        .updateWebPageOrderNumbers(webPageOrderNumbers)
        .pipe(
          tap((result) => {
            if (result?.status !== 200) {
              this.onGetPagesByPageID();
              this.snackBar.openFromComponent(StatusSnackbarComponent, {
                data: {
                  type: StatusSnackbarType.ERROR,
                  message: `${result?.value}`,
                } as StatusSnackbarModel,
              });
            } else {
              this.websiteService.$triggerMenuHTML.next(null);
            }
          }),
          catchError((e) => {
            console.log('e => updateWebPageOrderNumbers :>> ', e);
            this.showUnexpectedError();
            return EMPTY;
          }),
          takeUntil(this.destroy$),
        )
        .subscribe();
    }
  }

  getItemIndexOfContainer(siteId: string, container: ICmsSite[]): number {
    return container.findIndex((item) => item.siteId === siteId);
  }

  isDropAvailable(): boolean {
    const before = document.querySelectorAll(`.drop-${EDropPostion.BEFORE}`).length;
    const beforeMaxLevel = document.querySelectorAll(`.drop-${EDropPostion.BEFORE_MAX_LEVEL}`).length;
    const after = document.querySelectorAll(`.drop-${EDropPostion.AFTER}`).length;
    const afterMaxLevel = document.querySelectorAll(`.drop-${EDropPostion.AFTER_MAX_LEVEL}`).length;
    const inside = document.querySelectorAll(`.drop-${EDropPostion.INSIDE}`).length;
    const insideMaxLevel = document.querySelectorAll(`.drop-${EDropPostion.INSIDE_MAX_LEVEL}`).length;
    return before || beforeMaxLevel || after || afterMaxLevel || inside || insideMaxLevel ? true : false;
  }

  getParentNodeId(id: string, nodesToSearch: ICmsSite[], parentId: string): string {
    for (const node of nodesToSearch) {
      if (node.siteId === id) return parentId;
      const ret = this.getParentNodeId(id, node.child, node.siteId);
      if (ret) return ret;
    }
    return null;
  }

  updateDragItemAttribute(dragElement: HTMLElement, draggedItem: ICmsSite): void {
    if (dragElement) {
      draggedItem.currentLevel = +dragElement.getAttribute('data-level');
      draggedItem.parentId = dragElement.getAttribute('data-parent-id');
      draggedItem.nestedLevel = +dragElement.getAttribute('data-nested-level');
    }
    if (draggedItem.child.length) {
      this.updateDragItemChildAttributes(draggedItem.child);
    }
  }

  updateDragItemChildAttributes(dragItemChilds: ICmsSite[]): void {
    dragItemChilds.forEach((draggedItem) => {
      const nativeDragItem = document.getElementById(`node-${draggedItem.siteId}`);
      if (nativeDragItem) {
        draggedItem.currentLevel = +nativeDragItem.getAttribute('data-level');
        draggedItem.parentId = nativeDragItem.getAttribute('data-parent-id');
      }
      this.updateDragItemChildAttributes(draggedItem.child);
    });
  }

  updateNestedParentLevel(): void {
    for (let i = 0; i < this.cmsIdArray.length; i++) {
      this.updateNestedItem(this.nodeLookup[this.cmsIdArray[i]], this.cmsIdArray[i], 1);
    }
  }

  updateNestedItem(site: ICmsSite, siteId: string, count: number): void {
    this.nodeLookup[siteId].nestedLevel = count;
    if (site.child.length) {
      count++;
      for (let i = 0; i < site.child.length; i++) {
        if (site.child[i].child.length) this.updateNestedItem(site.child[i], siteId, count);
      }
    }
    if (this.nodeLookup[siteId].nestedLevel <= count) {
      this.nodeLookup[siteId].nestedLevel = count;
    }
  }

  showDragInfo(): void {
    this.clearDragInfo();
    if (this.dropActionTodo) {
      document.getElementById('node-' + this.dropActionTodo.targetId).classList.add('drop-' + this.dropActionTodo.action);
    }
  }

  clearDragInfo(dropped = false): void {
    if (dropped) {
      this.dropActionTodo = null;
    }
    document.querySelectorAll(`.drop-${EDropPostion.BEFORE}`).forEach((element) => element.classList.remove(`drop-${EDropPostion.BEFORE}`));
    document.querySelectorAll(`.drop-${EDropPostion.BEFORE_MAX_LEVEL}`).forEach((element) => element.classList.remove(`drop-${EDropPostion.BEFORE_MAX_LEVEL}`));
    document.querySelectorAll(`.drop-${EDropPostion.AFTER}`).forEach((element) => element.classList.remove(`drop-${EDropPostion.AFTER}`));
    document.querySelectorAll(`.drop-${EDropPostion.AFTER_MAX_LEVEL}`).forEach((element) => element.classList.remove(`drop-${EDropPostion.AFTER_MAX_LEVEL}`));
    document.querySelectorAll(`.drop-${EDropPostion.INSIDE}`).forEach((element) => element.classList.remove(`drop-${EDropPostion.INSIDE}`));
    document.querySelectorAll(`.drop-${EDropPostion.INSIDE_MAX_LEVEL}`).forEach((element) => element.classList.remove(`drop-${EDropPostion.INSIDE_MAX_LEVEL}`));
  }

  getSearchFormGroup(): FormGroup {
    const searchFormGroup = this.fb.group({
      search: [''],
    });
    return searchFormGroup;
  }

  onPageFilterSearch(): void {
    this.searchForm
      .get('search')
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((searchKey: string) => {
          this.cmsSites = this.cmsStoredSites.filter((site) => site.title.toUpperCase().includes(searchKey.toUpperCase()));
          return of(this.cmsSites);
        }),
      )
      .subscribe();
  }

  getNewPageFormGroup(): FormGroup {
    const newPageFormGroup = this.fb.group({
      name: ['', [Validators.required]],
    });
    return newPageFormGroup;
  }

  getRenameFormGroup(): FormGroup {
    const renameFormGroup = this.fb.group({
      name: ['', [Validators.required]],
    });
    return renameFormGroup;
  }

  onActiveCurrentSite(site: ICmsSite): void {
    if (isEqual(site, this.previousActiveSite)) return;
    if (this.previousActiveSite) this.previousActiveSite.isActive = false;
    this.previousActiveSite = site;
    this.onDeactiveCreateNewPage();
  }

  onActiveCreateNewPage(fromChild: boolean): void {
    this.createNewPageStatus = true;
    this.createNewPageFromChildStatus = fromChild;
    this.sidebar.setCreatePageStatus(true);
    this.onDeactiveRename();
  }

  onDeactiveCreateNewPage(): void {
    this.createNewPageStatus = false;
    this.createNewPageFromChildStatus = false;
    this.sidebar.setCreatePageStatus(false);
  }

  onActiveRename(): void {
    this.renameStatus = true;
    this.onDeactiveCreateNewPage();
  }

  onDeactiveRename(): void {
    this.renameStatus = false;
  }

  onCreateNewPage(parentSite: ICmsSite): void {
    const currentLevel = parentSite?.currentLevel ? parentSite.currentLevel + 1 : 1;
    const orderNumber = parentSite?.child ? parentSite.child.length : this.cmsSites.length;
    if (this.newPageForm.valid) {
      const initPage: IWebPagePage = {
        _id: null,
        parentID: parentSite?.siteId ? parentSite.siteId : null,
        orderNumber: orderNumber,
        masterPageID: null,
        name: this.newPageForm.get('name').value,
        isHide: false,
        isHomepage: false,
        setting: null,
        permission: null,
        configs: null,
        themeLayoutMode: null,
      };
      const isCustomMenu = this.menuGroupId;
      if (isCustomMenu) {
        this.menuCustomService
          .createMenuPage(currentLevel, initPage, this.menuGroupId)
          .pipe(
            takeUntil(this.destroy$),
            tap((result: IWebPagePage) => {
              if (result) {
                this.oneAddNewPage(parentSite, result);
                this.snackBar.openFromComponent(StatusSnackbarComponent, {
                  data: {
                    type: StatusSnackbarType.SUCCESS,
                    message: 'New Page Added!',
                  } as StatusSnackbarModel,
                });
                this.websiteService.$triggerMenuHTML.next(null);
              } else {
                this.snackBar.openFromComponent(StatusSnackbarComponent, {
                  data: {
                    type: StatusSnackbarType.ERROR,
                    message: 'Cannot Add New Page. Try Again Later!',
                  } as StatusSnackbarModel,
                });
              }
            }),
            catchError((e) => {
              console.log('e  => onCreateNewPage :>> ', e);
              this.showUnexpectedError();
              return EMPTY;
            }),
          )
          .subscribe();
      } else {
        this.siteMenuPageService
          .createWebPage(currentLevel, initPage)
          .pipe(
            takeUntil(this.destroy$),
            tap((result: IWebPagePage) => {
              if (result) {
                this.oneAddNewPage(parentSite, result);
                this.snackBar.openFromComponent(StatusSnackbarComponent, {
                  data: {
                    type: StatusSnackbarType.SUCCESS,
                    message: 'New Page Added!',
                  } as StatusSnackbarModel,
                });
                this.websiteService.$triggerMenuHTML.next(null);
                this.cmsWebPagesData = this.updateAddNewPage(currentLevel, result, this.cmsWebPagesData);
                this.siteMenuPageService.AllPage$.next(this.cmsWebPagesData);
              } else {
                this.snackBar.openFromComponent(StatusSnackbarComponent, {
                  data: {
                    type: StatusSnackbarType.ERROR,
                    message: 'Cannot Add New Page. Try Again Later!',
                  } as StatusSnackbarModel,
                });
              }
            }),
            catchError((e) => {
              console.log('e  => onCreateNewPage :>> ', e);
              this.showUnexpectedError();
              return EMPTY;
            }),
          )
          .subscribe();
      }
      this.onDeactiveCreateNewPage();
      this.newPageForm.get('name').patchValue('');
    } else {
      this.snackBar.openFromComponent(StatusSnackbarComponent, {
        data: {
          type: StatusSnackbarType.WARNING,
          message: 'Please provide a valid Page Name!',
        } as StatusSnackbarModel,
      });
    }
  }

  oneAddNewPage(parentSite: ICmsSite, page: IWebPagePage): void {
    const initPage: ICmsSite = {
      title: page.name,
      isHide: page.isHide,
      isDraggable: true,
      isHomePage: page.isHomepage,
      currentLevel: parentSite?.currentLevel ? parentSite.currentLevel + 1 : 1,
      nestedLevel: 1,
      siteId: page._id,
      child: [],
      isToggleStatus: false,
      parentId: !page.parentID ? 'main' : page.parentID,
      isActive: false,
    };
    if (!page.parentID) {
      this.cmsSites.push(initPage);
    } else {
      parentSite.child.push(initPage);
      parentSite.isToggleStatus = true;
    }
  }

  updateAddNewPage(currentLevel: number, page: IWebPagePage, AllWebPage: IWebPage[]): IWebPage[] {
    const WebPages = AllWebPage.find((webPage) => webPage.level === currentLevel);
    WebPages.pages.push(page);
    return AllWebPage;
  }

  updateDeletePage(webPagePositions: IWebPageFromToContainer[], AllWebPage: IWebPage[]): IWebPage[] {
    const deleteId = [];
    webPagePositions.forEach((webPage) => {
      deleteId.push(webPage._id);
    });
    for (let i = 0; i < AllWebPage.length; i++) {
      for (let j = 0; j < AllWebPage[i].pages.length; j++) {
        if (deleteId.indexOf(AllWebPage[i].pages[j]._id) !== -1) {
          AllWebPage[i].pages.splice(j, 1);
        }
      }
    }
    return AllWebPage;
  }
  updateRenamePage(AllWebPage: IWebPage[], _id: string, changeName: string): IWebPage[] {
    for (let i = 0; i < AllWebPage.length; i++) {
      const currentPage = AllWebPage[i].pages.find((page) => page._id === _id);
      if (currentPage) {
        currentPage.name = changeName;
      }
    }
    return AllWebPage;
  }
  updateSetHomePage(AllWebPage: IWebPage[], _id: string): IWebPage[] {
    for (let i = 0; i < AllWebPage.length; i++) {
      const currentPage = AllWebPage[i].pages.find((page) => {
        page.isHomepage = false;
        return page._id === _id;
      });
      if (currentPage) {
        currentPage.isHomepage = true;
        this.homePageWebPage = currentPage;
      }
    }
    return AllWebPage;
  }

  activeHiddenSite(site: ICmsSite): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        type: ConfirmDialogType.ACTION,
        title: 'Site Confirmation',
        content: `Are you sure to activate site: ${site.title}?`,
      } as ConfirmDialogModel,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        site.isHide = false;
      }
    });
  }

  onActiveToggleSite(site: ICmsSite): void {
    site.isToggleStatus = !site.isToggleStatus;
  }

  siteMenuOptionEvent(event: SiteOptionActionTypes, siteItem: ICmsSite): void {
    switch (event) {
      case SiteOptionActionTypes.CREATE_NEW:
        this.onActiveCreateNewPage(true);
        break;
      case SiteOptionActionTypes.HIDE:
        this.onUpdateSiteHide(siteItem);
        break;
      case SiteOptionActionTypes.DUPLICATE:
        break;
      case SiteOptionActionTypes.RENAME:
        this.onActiveRename();
        this.renameForm.get('name').patchValue(siteItem.title);
        break;
      case SiteOptionActionTypes.SET_HOME_PAGE:
        this.onSetHomePage(siteItem);

        break;
      case SiteOptionActionTypes.SETTINGS:
        this.sidebarService.setMenuGroupId(this.menuGroupId);
        this.sidebarService.setSidebarMode(ESidebarMode.SITE_SETTING);
        this.sidebarService.setSiteId(siteItem.siteId);
        break;
      case SiteOptionActionTypes.DELETE:
        this.onRemoveSiteFromContainer(siteItem);
        break;
      default:
        break;
    }
  }

  onUpdateSiteHide(siteItem: ICmsSite): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        type: ConfirmDialogType.ACTION,
        title: 'Hide Site Confirmation',
        content: `Hide site: ${siteItem.title} and its childs. Are you sure to continue?`,
      } as ConfirmDialogModel,
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((agree) => {
        if (agree) {
          const isHide = siteItem.isHide;
          this.getUpdateSitesHide(siteItem);
          const isCustomMenu = this.menuGroupId;
          if (isCustomMenu) {
            this.menuCustomService
              .updateMenuPagesHide(this.updateWebPagesHide, !isHide, this.menuGroupId)
              .pipe(
                takeUntil(this.destroy$),
                tap((result: IHTTPResult) => {
                  if (result?.status === 200) {
                    this.onHideSites(siteItem, !isHide);
                    if (isHide)
                      this.snackBar.openFromComponent(StatusSnackbarComponent, {
                        data: {
                          type: StatusSnackbarType.SUCCESS,
                          message: 'Site and its children are showed!',
                        } as StatusSnackbarModel,
                      });
                    else {
                      this.snackBar.openFromComponent(StatusSnackbarComponent, {
                        data: {
                          type: StatusSnackbarType.SUCCESS,
                          message: 'Site and its children are hidden!',
                        } as StatusSnackbarModel,
                      });
                    }
                    this.websiteService.$triggerMenuHTML.next(null);
                  } else {
                    this.snackBar.openFromComponent(StatusSnackbarComponent, {
                      data: {
                        type: StatusSnackbarType.ERROR,
                        message: `${result?.value}`,
                      } as StatusSnackbarModel,
                    });
                  }
                }),
                catchError((e) => {
                  console.log('e  => onUpdateSiteHide :>> ', e);
                  this.showUnexpectedError();
                  return EMPTY;
                }),
              )
              .subscribe();
          } else {
            this.siteMenuPageService
              .updateWebPagesHide(this.updateWebPagesHide, !isHide)
              .pipe(
                takeUntil(this.destroy$),
                tap((result: IHTTPResult) => {
                  if (result?.status === 200) {
                    this.onHideSites(siteItem, !isHide);
                    if (isHide)
                      this.snackBar.openFromComponent(StatusSnackbarComponent, {
                        data: {
                          type: StatusSnackbarType.SUCCESS,
                          message: 'Site and its children are showed!',
                        } as StatusSnackbarModel,
                      });
                    else {
                      this.snackBar.openFromComponent(StatusSnackbarComponent, {
                        data: {
                          type: StatusSnackbarType.SUCCESS,
                          message: 'Site and its children are hidden!',
                        } as StatusSnackbarModel,
                      });
                    }
                    this.websiteService.$triggerMenuHTML.next(null);
                  } else {
                    this.snackBar.openFromComponent(StatusSnackbarComponent, {
                      data: {
                        type: StatusSnackbarType.ERROR,
                        message: `${result?.value}`,
                      } as StatusSnackbarModel,
                    });
                  }
                }),
                catchError((e) => {
                  console.log('e  => onUpdateSiteHide :>> ', e);
                  this.showUnexpectedError();
                  return EMPTY;
                }),
              )
              .subscribe();
          }
        }
      });
  }

  onHideSites(siteItem: ICmsSite, status: boolean): void {
    siteItem.isHide = status;
    this.onHideChildSites(siteItem.child, status);
  }

  onHideChildSites(sites: ICmsSite[], status: boolean): void {
    sites.forEach((site) => {
      site.isHide = status;
      this.onHideChildSites(site.child, status);
    });
  }

  getUpdateSitesHide(siteItem: ICmsSite): void {
    this.updateWebPagesHide = [];
    const updateSiteHide: IUpdateWebPagesHide = {
      _id: siteItem.siteId,
      level: siteItem.currentLevel,
    };
    this.updateWebPagesHide.push(updateSiteHide);
    this.getUpdateChildSitesHide(siteItem.child);
  }

  getUpdateChildSitesHide(sites: ICmsSite[]): void {
    sites.forEach((site) => {
      const updateSiteHide: IUpdateWebPagesHide = {
        _id: site.siteId,
        level: site.currentLevel,
      };
      this.updateWebPagesHide.push(updateSiteHide);
      this.getUpdateChildSitesHide(site.child);
    });
  }

  onSetHomePage(siteItem: ICmsSite): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        type: ConfirmDialogType.ACTION,
        title: 'Homepage Confirmation',
        content: `Set site: ${siteItem.title} - as Homepage. Are you sure to continue?`,
      } as ConfirmDialogModel,
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((agree) => {
        if (agree) {
          this.getSiteHomepage(this.cmsSites);
          const updateWebPageHomePage: IUpdateWebPageHomePage = {
            previousLevel: this.currentHomeSite?.currentLevel,
            previousId: this.currentHomeSite?.siteId,
            currentLevel: siteItem.currentLevel,
            currentId: siteItem.siteId,
          };
          const isCustomMenu = this.menuGroupId;
          if (isCustomMenu) {
            this.menuCustomService
              .updateMenuPageHomepage(updateWebPageHomePage, this.menuGroupId)
              .pipe(
                takeUntil(this.destroy$),
                tap((result: IHTTPResult) => {
                  if (result?.status === 200) {
                    siteItem.isHomePage = true;
                    if (this.currentHomeSite) this.currentHomeSite.isHomePage = false;
                    this.snackBar.openFromComponent(StatusSnackbarComponent, {
                      data: {
                        type: StatusSnackbarType.SUCCESS,
                        message: 'Homepage is updated!',
                      } as StatusSnackbarModel,
                    });
                    this.getSiteHomepage(this.cmsSites);
                  } else {
                    this.snackBar.openFromComponent(StatusSnackbarComponent, {
                      data: {
                        type: StatusSnackbarType.ERROR,
                        message: `${result?.value}`,
                      } as StatusSnackbarModel,
                    });
                  }
                }),
                catchError((e) => {
                  console.log('e  => onSetHomePage :>> ', e);
                  this.showUnexpectedError();
                  return EMPTY;
                }),
              )
              .subscribe();
          } else {
            this.siteMenuPageService
              .updateWebPageHomepage(updateWebPageHomePage)
              .pipe(
                takeUntil(this.destroy$),
                tap((result: IHTTPResult) => {
                  if (result?.status === 200) {
                    siteItem.isHomePage = true;
                    this.currentHomeSite = siteItem;
                    this.updateSetHomePage(this.cmsWebPagesData, siteItem.siteId);
                    this.siteMenuPageService.AllPage$.next(this.cmsWebPagesData);
                    if (this.currentHomeSite) this.currentHomeSite.isHomePage = false;
                    this.snackBar.openFromComponent(StatusSnackbarComponent, {
                      data: {
                        type: StatusSnackbarType.SUCCESS,
                        message: 'Homepage is updated!',
                      } as StatusSnackbarModel,
                    });
                    this.getSiteHomepage(this.cmsSites);
                  } else {
                    this.snackBar.openFromComponent(StatusSnackbarComponent, {
                      data: {
                        type: StatusSnackbarType.ERROR,
                        message: `${result?.value}`,
                      } as StatusSnackbarModel,
                    });
                  }
                }),
                catchError((e) => {
                  console.log('e  => onSetHomePage :>> ', e);
                  this.showUnexpectedError();
                  return EMPTY;
                }),
              )
              .subscribe();
          }
        }
      });
  }

  getSiteHomepage(sites: ICmsSite[]): void {
    sites.forEach((site) => {
      if (site.isHomePage) {
        this.currentHomeSite = site;
        return;
      }
      this.getSiteHomepage(site.child);
    });
  }

  onRenameSite(siteItem: ICmsSite): void {
    if (this.renameForm.valid) {
      const nameForm = this.renameForm.get('name');
      const newName = nameForm.value.replace(/\s+/g, '').toLowerCase();
      const oldName = siteItem.title.replace(/\s+/g, '').toLowerCase();
      if (newName === oldName) {
        this.snackBar.openFromComponent(StatusSnackbarComponent, {
          data: {
            type: StatusSnackbarType.WARNING,
            message: 'Please provide a different name!',
          } as StatusSnackbarModel,
        });
      } else {
        const name = nameForm.value.trim();
        nameForm.patchValue(name);
        const isCustomMenu = this.menuGroupId;
        if (isCustomMenu) {
          this.menuCustomService
            .updateMenuPageName(name, siteItem.currentLevel, siteItem.siteId, this.menuGroupId)
            .pipe(
              takeUntil(this.destroy$),
              tap((result: IHTTPResult) => {
                if (result?.status === 200) {
                  siteItem.title = name;
                  this.snackBar.openFromComponent(StatusSnackbarComponent, {
                    data: {
                      type: StatusSnackbarType.SUCCESS,
                      message: 'Name has been changed!',
                    } as StatusSnackbarModel,
                  });
                  this.websiteService.$triggerMenuHTML.next(null);
                } else {
                  this.snackBar.openFromComponent(StatusSnackbarComponent, {
                    data: {
                      type: StatusSnackbarType.ERROR,
                      message: `${result?.value}`,
                    } as StatusSnackbarModel,
                  });
                }
                this.onDeactiveRename();
                nameForm.patchValue('');
              }),
              catchError((e) => {
                console.log('e  => onRenameSite :>> ', e);
                this.showUnexpectedError();
                return EMPTY;
              }),
            )
            .subscribe();
        } else {
          this.siteMenuPageService
            .updateWebPageName(name, siteItem.currentLevel, siteItem.siteId)
            .pipe(
              takeUntil(this.destroy$),
              tap((result: IHTTPResult) => {
                if (result?.status === 200) {
                  siteItem.title = name;
                  this.updateRenamePage(this.cmsWebPagesData, siteItem.siteId, name);
                  this.siteMenuPageService.AllPage$.next(this.cmsWebPagesData);
                  this.snackBar.openFromComponent(StatusSnackbarComponent, {
                    data: {
                      type: StatusSnackbarType.SUCCESS,
                      message: 'Name has been changed!',
                    } as StatusSnackbarModel,
                  });
                  this.websiteService.$triggerMenuHTML.next(null);
                } else {
                  this.snackBar.openFromComponent(StatusSnackbarComponent, {
                    data: {
                      type: StatusSnackbarType.ERROR,
                      message: `${result?.value}`,
                    } as StatusSnackbarModel,
                  });
                }
                this.onDeactiveRename();
                nameForm.patchValue('');
              }),
              catchError((e) => {
                console.log('e  => onRenameSite :>> ', e);
                this.showUnexpectedError();
                return EMPTY;
              }),
            )
            .subscribe();
        }
      }
    } else {
      this.snackBar.openFromComponent(StatusSnackbarComponent, {
        data: {
          type: StatusSnackbarType.ERROR,
          message: 'Please provide a valid name!',
        } as StatusSnackbarModel,
      });
    }
  }

  showUnexpectedError(): void {
    this.snackBar.openFromComponent(StatusSnackbarComponent, {
      data: {
        type: StatusSnackbarType.ERROR,
        message: 'Unexpected Error occured...Try again later!',
      } as StatusSnackbarModel,
    });
  }

  onRemoveSiteFromContainer(siteItem: ICmsSite): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        type: ConfirmDialogType.ACTION,
        title: `Site: ${siteItem.title} Delete Confirmation`,
        content: 'All of components and its setting will be deleted, also its childs. This action cannot be recovered. Are you sure to continue?',
      } as ConfirmDialogModel,
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((agree) => {
        if (agree) {
          this.updateSitePositions(siteItem, null);
          const webPageOrderNumbers = this.getSiteOrderNumbers(this.getSitesContainer(siteItem.parentId, siteItem.siteId));
          const isCustomMenu = this.menuGroupId;
          if (isCustomMenu) {
            this.menuCustomService
              .removeMenuPageFromContainer(this.webPagePositions, webPageOrderNumbers, this.menuGroupId)
              .pipe(
                takeUntil(this.destroy$),
                tap((result) => {
                  if (result?.status !== 200) {
                    this.snackBar.openFromComponent(StatusSnackbarComponent, {
                      data: {
                        type: StatusSnackbarType.ERROR,
                        message: `${result?.value}`,
                      } as StatusSnackbarModel,
                    });
                  } else {
                    this.removeSitesContainer(siteItem.parentId, siteItem.siteId);
                    this.snackBar.openFromComponent(StatusSnackbarComponent, {
                      data: {
                        type: StatusSnackbarType.SUCCESS,
                        message: 'Sites are removed successfully!',
                      } as StatusSnackbarModel,
                    });
                    this.websiteService.$triggerMenuHTML.next(null);
                  }
                }),
                catchError((e) => {
                  console.log('e  => onRemoveSiteFromContainer :>> ', e);
                  this.showUnexpectedError();
                  return EMPTY;
                }),
              )
              .subscribe();
          } else {
            const page = this.webPagePositions.filter((webPage) => webPage._id === this.currentHomeSite.siteId);
            if (page.length <= 0) {
              this.siteMenuPageService
                .removeWebPageFromContainer(this.webPagePositions, webPageOrderNumbers)
                .pipe(
                  takeUntil(this.destroy$),
                  tap((result) => {
                    if (result?.status !== 200) {
                      this.snackBar.openFromComponent(StatusSnackbarComponent, {
                        data: {
                          type: StatusSnackbarType.ERROR,
                          message: `${result?.value}`,
                        } as StatusSnackbarModel,
                      });
                    } else {
                      this.removeSitesContainer(siteItem.parentId, siteItem.siteId);
                      this.cmsWebPagesData = this.updateDeletePage(this.webPagePositions, this.cmsWebPagesData);
                      this.siteMenuPageService.AllPage$.next(this.cmsWebPagesData);
                      this.changeToHomePage();
                      this.onActiveCurrentSite(this.currentHomeSite);
                      this.siteMenuPageService.currentPage$.next(this.homePageWebPage);
                      this.snackBar.openFromComponent(StatusSnackbarComponent, {
                        data: {
                          type: StatusSnackbarType.SUCCESS,
                          message: 'Sites are removed successfully!',
                        } as StatusSnackbarModel,
                      });
                      this.websiteService.$triggerMenuHTML.next(null);
                    }
                  }),
                  catchError((e) => {
                    console.log('e  => onRemoveSiteFromContainer :>> ', e);
                    this.showUnexpectedError();
                    return EMPTY;
                  }),
                )
                .subscribe();
            } else {
              this.showUnexpectedError();
            }
          }
        }
      });
  }

  removeSitesContainer(parentId: string, removeId: string): void {
    let siteContainer: ICmsSite[] = [];
    if (parentId !== 'main') {
      siteContainer = this.nodeLookup[parentId].child;
    } else {
      siteContainer = this.cmsSites;
    }
    const removeIndex = siteContainer.findIndex((site) => site.siteId === removeId);
    siteContainer.splice(removeIndex, 1);
  }

  getSitesContainer(parentId: string, removeId?: string): ICmsSite[] {
    let siteContainer: ICmsSite[] = [];
    if (parentId !== 'main') {
      siteContainer = [...this.nodeLookup[parentId].child];
    } else {
      siteContainer = [...this.cmsSites];
    }
    if (removeId) {
      const removeIndex = siteContainer.findIndex((site) => site.siteId === removeId);
      siteContainer.splice(removeIndex, 1);
    }
    return siteContainer;
  }

  onUpdatePageChildSelected(site: ICmsSite): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        type: ConfirmDialogType.ACTION,
        title: 'Child Selected Confirmation',
        content: `Update selected status for site ${site.title} & its childs. Are you sure to continue?`,
      } as ConfirmDialogModel,
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((agree) => {
        if (agree) {
          if (this.previousChildSelectedSite) this.previousChildSelectedSite.isChildSelected = false;
          site.isChildSelected = true;
          this.previousChildSelectedSite = site;
          this.parentMenuIdEvent.emit(site.siteId);
        }
      });
  }
  onChangePage(event: MouseEvent, site: ICmsSite): void {
    event.stopPropagation();
    let currentPage;
    this.cmsWebPagesData.forEach((webPages) => {
      const page = webPages.pages.find((page) => page._id === site.siteId);
      if (page) {
        currentPage = page;
      }
    });
    this.siteMenuPageService.currentPage$.next(currentPage);
    this.router.navigate([`cms/edit/site-management/${site.siteId}`]);
  }
  onClickPrevenetDefault(event: MouseEvent): void {
    event.stopPropagation();
  }
  changeToHomePage() {
    this.router.navigate([`cms/edit/site-management/${this.currentHomeSite.siteId}`]);
  }
}
