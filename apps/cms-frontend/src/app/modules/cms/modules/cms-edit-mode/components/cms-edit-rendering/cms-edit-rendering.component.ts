import { DragDrop, DragRef, DropListRef, transferArrayItem } from '@angular/cdk/drag-drop';
import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ElementRef,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Type,
  ViewChild,
  ViewContainerRef,
  ViewRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ECmsEditRenderingMode, EDropzoneType, IPageComponent, IThemeRendering, MenuGenericType, MenuType, RouteLinkEnum, UndoRedoEnum } from '@reactor-room/cms-models-lib';
import { environmentLib } from '@reactor-room/environment-services-frontend';
import { combineLatest, EMPTY, forkJoin, Observable, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { UndoRedoService } from '../../../../../../services/undo-redo.service';
import { CmsCreateThemeService } from '../../../../services/cms-create-template.service';
import { CmsEditRenderingService } from '../../../../services/cms-edit-rendering.service';
import { CmsEditService } from '../../../../services/cms-edit.service';
import { CmsPublishService } from '../../../../services/cms-publish.service';
import { CmsSidebarService } from '../../../../services/cms-sidebar.service';
import { replaceHrefAttribute } from '../../../../services/domain/common.domain';
import { WebsiteService } from '../../../../services/website.service';
import { DragRefData, Dropped, DropZoneData, ViewRefAndElementRefAndComponent } from './cms-edit-rendering.model';

@Component({
  selector: 'cms-next-cms-edit-rendering',
  templateUrl: './cms-edit-rendering.component.html',
  styleUrls: ['./cms-edit-rendering.component.scss'],
})
export class CmsEditRenderingComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('themePoint', { static: true, read: ViewContainerRef }) themePoint: ViewContainerRef;
  @ViewChild('removedZone', { static: true }) removedZone: ElementRef<HTMLDivElement>;
  @ViewChild('removedInsertPoint', { static: true, read: ViewContainerRef }) removedInsertPoint: ViewContainerRef;
  insertPoint: ViewContainerRef;
  currentMode: ECmsEditRenderingMode;
  ECmsEditRenderingMode = ECmsEditRenderingMode;
  pageTheme: IThemeRendering;
  private destroy$ = new Subject();
  @Input() public onFocus = false;
  isChildEnter = false;
  webPageId: string;
  constructor(
    private cmsEditService: CmsEditService,
    private dragDrop: DragDrop,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private router: Router,
    private routParam: ActivatedRoute,
    private renderMode: CmsEditRenderingService,
    private cmsCreateThemeService: CmsCreateThemeService,
    private undoRedoService: UndoRedoService,
    private websiteService: WebsiteService,
    private dialog: MatDialog,
    private publishService: CmsPublishService,
    private cmsSidebarService: CmsSidebarService,
  ) {
    this.handleRoutingService();
    renderMode.getRenderingMode.subscribe((result) => (this.currentMode = result));
  }
  ngOnInit(): void {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    combineLatest([this.routParam.params, this.websiteService.$themeLayoutIndex.pipe(distinctUntilChanged(), takeUntil(this.destroy$))])
      .pipe(
        takeUntil(this.destroy$),
        switchMap(([{ webPageId, prevWebPageId, componentId, contentId }, themeLayoutIndex]) => {
          if (!webPageId) return;
          this.webPageId = webPageId;
          let pageComponent: Observable<IPageComponent>;
          if (webPageId && prevWebPageId && componentId && contentId) {
            pageComponent = this.websiteService.getLandingComponent(webPageId, prevWebPageId, componentId, contentId);
          } else {
            this.cmsSidebarService.setLandingMode(null);
            pageComponent = this.websiteService.getComponent(webPageId);
          }
          const webapgeThemelayoutIndex = { webPageID: webPageId, themeLayoutIndex };
          const themeComponents = this.websiteService.getThemeComponents(webapgeThemelayoutIndex);
          return forkJoin([pageComponent, themeComponents]);
        }),
      )
      .pipe(
        tap(([pageComponent, themeComponents]) => {
          if (pageComponent) {
            this.websiteService.$pageComponent.next(pageComponent);
            this.publishService.initComponentData(pageComponent.components, this.webPageId);
          }
          if (themeComponents) {
            this.websiteService.$themeComponents.next(themeComponents.themeComponents);
            this.publishService.initThemeData(themeComponents.themeComponents);
          }
          if (pageComponent && themeComponents) {
            this.websiteService.$angularHTML.next({ angularHtmlPageComponent: pageComponent.angularHTML, angularHtmlThemeComponent: themeComponents.angularHTML });
          }
        }),
        catchError((error) => {
          console.log('error :>> ', error);
          return EMPTY;
        }),
      )
      .subscribe();
  }

  ngAfterViewInit(): void {
    this.onSaveTrigger();
    this.onLoadThemeService();
    const removedDropListRef = this.dragDrop.createDropList<DropZoneData>(this.removedZone);
    this.cmsEditService.addRemovedDropListRef(removedDropListRef);
    removedDropListRef.data = { dragRefs: [], viewRefAndElementRefAndComponents: [], dropzoneType: EDropzoneType.REMOVE };
    this.cmsEditService.removedDropListRef.dropped.subscribe((event) => {
      const { currentIndex: currentIndex, previousContainer, container, item } = event;
      const vcr = this.removedInsertPoint;
      const from = previousContainer.data.viewRefAndElementRefAndComponents.findIndex((c) => c.component.dragRef === item);
      const { component } = previousContainer.data.viewRefAndElementRefAndComponents[from];
      this.moveViewRefTo(vcr, component.viewRef, 0);
      this.moveLayoutData(previousContainer, container, from, 0);
      const dragRef = this.createAndInsertDragRefToContainer(component.el, currentIndex, container, item.data.type, item.data.genericType);
      component.dragRef = dragRef;
      const dropped: Dropped = { ...event, item: dragRef, component };
      if (!event.item.data?.undoRedoDropped || event.item.data.undoRedoDropped === UndoRedoEnum.Redo) {
        this.undoRedoService.addDroppedUndo(dropped);
      } else if (event.item.data.undoRedoDropped === UndoRedoEnum.Undo) {
        this.undoRedoService.addDroppedRedo(dropped);
      }
      this.publishService.savingTrigger$.next(Math.round(+new Date() / 1000));
    });
  }

  onSaveTrigger() {
    this.publishService.savingTrigger$.pipe(takeUntil(this.destroy$), distinctUntilChanged(), debounceTime(1000)).subscribe(() => {
      this.publishService.savePageThemeComponents(
        this.cmsEditService.contentInsertPointContainer.value,
        this.cmsEditService.headerInsertPointContainer.value,
        this.cmsEditService.footerInsertPointContainer.value,
      );
    });
  }

  onLoadThemeService(): void {
    this.websiteService.$angularHTML
      .pipe(
        takeUntil(this.destroy$),
        switchMap((angularHTML) => {
          let template = angularHTML.angularHtmlThemeComponent;
          console.log('angularHTML.angularHtmlPageComponent', angularHTML.angularHtmlPageComponent);
          template = template.replace('[CONTENT]', angularHTML.angularHtmlPageComponent);
          return this.websiteService.$pageTheme.pipe(
            take(1),
            switchMap((pageTheme) => {
              const styleUrls = [];
              pageTheme?.style.forEach((style) => {
                styleUrls.push(style?.url);
              });
              console.log(styleUrls);
              const properties = {};
              void this.cmsCreateThemeService.createComponentFromRaw(template, styleUrls, properties, this.themePoint);
              return this.websiteService.getUpdatedSiteCSS();
            }),
            tap((result) => {
              if (result.status === 200) {
                const replaceTerm = environmentLib.cms.CMSFileSettingName;
                const replaceValue = result.value;
                replaceHrefAttribute(replaceTerm, replaceValue);
              }
            }),
          );
        }),
      )
      .subscribe(
        (next) => {
          console.log('onLoadThemeService next', next);
        },
        (err) => {
          console.log('onLoadThemeService err: ', err);
        },
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  handleRoutingService(): void {
    const currentRoute = this.router.url;
    if (currentRoute.includes(RouteLinkEnum.SHORTCUT_CONTENT_MANAGEMENT)) {
      this.renderMode.setRenderingMode(ECmsEditRenderingMode.CONTENT_MANAGE);
    }
  }

  createComponent<T>(component: Type<T>): ComponentRef<T> {
    const factory = this.resolver.resolveComponentFactory<T>(component);
    const componentRef = factory.create(this.injector);
    componentRef.changeDetectorRef.detectChanges();
    return componentRef;
  }

  insertComponentRef(viewRefAndElementRefAndComponents: ViewRefAndElementRefAndComponent[], at: number, viewRefAndElementRefAndComponent: ViewRefAndElementRefAndComponent): void {
    viewRefAndElementRefAndComponents.splice(at, 0, viewRefAndElementRefAndComponent);
  }

  createAndInsertDragRefToContainer(elementRef: ElementRef, at: number, container: DropListRef, type: MenuType, genericType: MenuGenericType): DragRef {
    const dragRef = this.dragDrop.createDrag<DragRefData>(elementRef);
    container.data.dragRefs.splice(at, 0, dragRef);
    container.withItems(container.data.dragRefs);
    dragRef.data = { dropListRef: container, type: type, genericType: genericType };
    this.cmsEditService.dragHandler(dragRef, this.destroy$);
    return dragRef;
  }

  moveViewRefTo(vcr: ViewContainerRef, viewRef: ViewRef, to: number): void {
    vcr.move(viewRef, to);
  }

  moveLayoutData(fromContainer: DropListRef<DropZoneData>, toContainer: DropListRef<DropZoneData>, from: number, to: number): void {
    transferArrayItem(fromContainer.data.viewRefAndElementRefAndComponents, toContainer.data.viewRefAndElementRefAndComponents, from, to);
    const previousDragRefs = fromContainer.data.dragRefs;
    previousDragRefs[from].dispose();
    previousDragRefs.splice(from, 1);
    fromContainer.withItems(previousDragRefs);
  }
}
