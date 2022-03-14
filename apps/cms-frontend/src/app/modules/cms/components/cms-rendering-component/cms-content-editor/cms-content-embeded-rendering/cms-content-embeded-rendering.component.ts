import { Component, ElementRef, forwardRef, OnDestroy, OnInit, QueryList, ViewContainerRef, ViewRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {
  EContentEditorComponentType,
  IContentEditorComponent,
  contentEditorComponentEmbededDefault,
  IContentEditorComponentEmbeded,
  IContentEditorComponentEmbededOption,
} from '@reactor-room/cms-models-lib';
import { ConfirmDialogComponent, ConfirmDialogType, ConfirmDialogModel } from '@reactor-room/itopplus-cdk';
import { deepCopy } from '@reactor-room/itopplus-front-end-helpers';
import { UndoRedoService } from 'apps/cms-frontend/src/app/services/undo-redo.service';
import { Children, getRootViewRef } from 'apps/cms-frontend/src/app/shares/utils';
import stringify from 'fast-json-stable-stringify';
import { Subject, Subscription } from 'rxjs';
import { takeUntil, distinctUntilChanged, pairwise, startWith, tap } from 'rxjs/operators';
import { ESidebarMode } from '../../../../containers/cms-sidebar/cms-sidebar.model';
import { ContentChildrenComponentType } from '../../../../modules/cms-edit-mode/components/cms-edit-rendering-content/cms-edit-rendering-content.model';
import { CmsCommonService } from '../../../../services/cms-common.service';
import { CmsContentEditService } from '../../../../services/cms-content-edit.service';
import { CmsSidebarService } from '../../../../services/cms-sidebar.service';
import { ICmsLanguageSwitch } from '../../../common/cms-language-switch/cms-language-switch.model';

@Component({
  selector: 'cms-next-cms-content-embeded-rendering',
  templateUrl: './cms-content-embeded-rendering.component.html',
  styleUrls: ['./cms-content-embeded-rendering.component.scss'],
  providers: [{ provide: Children, useExisting: forwardRef(() => CmsContentEmbededRenderingComponent) }],
})
export class CmsContentEmbededRenderingComponent implements OnInit, OnDestroy {
  componentPoint: ViewContainerRef;
  componentChildren: QueryList<ContentChildrenComponentType>;
  componentType = EContentEditorComponentType.EMBEDED;
  viewRef: ViewRef;
  onFocus = false;
  renderingData$ = new Subject<IContentEditorComponent>();
  destroy$ = new Subject();
  savingData = deepCopy(contentEditorComponentEmbededDefault);
  currentLangage: ICmsLanguageSwitch;
  isViewMode = false;
  layoutEmbededSubscription: Subscription;
  safeHTML: SafeHtml = null;
  constructor(
    public el: ElementRef,
    private cmsContentEditService: CmsContentEditService,
    private dialog: MatDialog,
    private cmsCommonService: CmsCommonService,
    private sidebarService: CmsSidebarService,
    private undoRedoService: UndoRedoService,
    private sanitizer: DomSanitizer,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.renderingData$.pipe(takeUntil(this.destroy$), distinctUntilChanged()).subscribe((data: IContentEditorComponentEmbeded) => {
      if (!data) return;
      this.savingData = data;
      this.safeHTML = this.getSafeHTMLRendering(this.savingData.option.embeded);
    });
    setTimeout(() => {
      this.viewRef = getRootViewRef(this) as ViewRef;
    }, 0);
    this.onCheckViewMode();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  onCheckViewMode(): void {
    if (this.router.url.includes('cms/edit/site-management')) this.isViewMode = true;
  }

  getSafeHTMLRendering(type: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(type) as SafeHtml;
  }

  onFocusEvent(): void {
    if (this.onFocus) return;
    this.onFocusComponent(this);
    this.sidebarService.setSidebarLayoutMode(null);
    this.onNavigate(null);
    setTimeout(() => {
      this.sidebarService.setSidebarLayoutMode(ESidebarMode.LAYOUT_SETTING_EMBEDED);
      this.setLayoutEmbededDataToFormValue();
    }, 0);
  }

  onFocusComponent(component: CmsContentEmbededRenderingComponent): void {
    if (this !== component) return;
    this.cmsContentEditService.onFocusCurrentComponent(this);
    this.setFormValueToLayoutEmbededData();
  }

  saveLayoutEmbededData(): void {
    this.sidebarService.setLayoutEmbededValue(null);
  }

  setFormValueToLayoutEmbededData(): void {
    if (this.layoutEmbededSubscription) return;
    this.layoutEmbededSubscription = this.sidebarService.getLayoutEmbededValue
      .pipe(
        startWith(this.savingData),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        pairwise(),
        tap(([oldValue, newVaLue]: [IContentEditorComponentEmbededOption, IContentEditorComponentEmbededOption]) => {
          if (!oldValue) return;
          if (stringify(oldValue) !== stringify(newVaLue) && newVaLue) {
            this.savingData.option = newVaLue;
            this.safeHTML = this.getSafeHTMLRendering(this.savingData.option.embeded);
          }
        }),
      )
      .subscribe();
  }

  setLayoutEmbededDataToFormValue(): void {
    this.sidebarService.setLayoutEmbededFormValue(this.savingData.option);
  }

  onRemoveComponent(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        type: ConfirmDialogType.DANGER,
        title: 'Delete Component Confirmation',
        content: 'Are you sure to delete this component?',
      } as ConfirmDialogModel,
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.cmsContentEditService.onRemoveComponent(this.componentPoint, this.componentChildren, this.viewRef);
      }
    });
  }

  onNavigate(key: string): void {
    this.cmsContentEditService.onNavigate(this.componentPoint, this.componentChildren, this.viewRef, key, this.el);
  }
}
