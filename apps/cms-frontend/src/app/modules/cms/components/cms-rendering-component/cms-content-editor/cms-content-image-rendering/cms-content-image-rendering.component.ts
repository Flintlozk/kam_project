import { Component, ElementRef, forwardRef, OnDestroy, OnInit, QueryList, ViewContainerRef, ViewRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {
  EContentEditorComponentType,
  IContentEditorComponent,
  contentEditorComponentImageDefault,
  IContentEditorComponentImage,
  IContentEditorComponentImageLanguage,
  EnumLanguageCultureUI,
  IContentEditorComponentImageOption,
} from '@reactor-room/cms-models-lib';
import { ConfirmDialogComponent, ConfirmDialogType, ConfirmDialogModel } from '@reactor-room/itopplus-cdk';
import { deepCopy } from '@reactor-room/itopplus-front-end-helpers';
import { UndoRedoService } from 'apps/cms-frontend/src/app/services/undo-redo.service';
import { Children, getRootViewRef } from 'apps/cms-frontend/src/app/shares/utils';
import stringify from 'fast-json-stable-stringify';
import { Subject, Subscription } from 'rxjs';
import { takeUntil, distinctUntilChanged, startWith, pairwise, tap } from 'rxjs/operators';
import { ESidebarMode } from '../../../../containers/cms-sidebar/cms-sidebar.model';
import { ContentChildrenComponentType } from '../../../../modules/cms-edit-mode/components/cms-edit-rendering-content/cms-edit-rendering-content.model';
import { CmsCommonService } from '../../../../services/cms-common.service';
import { CmsContentEditService } from '../../../../services/cms-content-edit.service';
import { CmsSidebarService } from '../../../../services/cms-sidebar.service';
import { ICmsLanguageSwitch } from '../../../common/cms-language-switch/cms-language-switch.model';

@Component({
  selector: 'cms-next-cms-content-image-rendering',
  templateUrl: './cms-content-image-rendering.component.html',
  styleUrls: ['./cms-content-image-rendering.component.scss'],
  providers: [{ provide: Children, useExisting: forwardRef(() => CmsContentImageRenderingComponent) }],
})
export class CmsContentImageRenderingComponent implements OnInit, OnDestroy {
  componentPoint: ViewContainerRef;
  componentChildren: QueryList<ContentChildrenComponentType>;
  componentType = EContentEditorComponentType.IMAGE;
  viewRef: ViewRef;
  onFocus = false;
  renderingData$ = new Subject<IContentEditorComponent>();
  destroy$ = new Subject();
  savingData = deepCopy(contentEditorComponentImageDefault);
  contentEditorComponentImageLanguage: IContentEditorComponentImageLanguage;
  currentLangage: ICmsLanguageSwitch;
  isViewMode = false;
  layoutImageSubscription: Subscription;
  safeHTML: SafeHtml = null;
  currentCultureUI: EnumLanguageCultureUI;
  constructor(
    public el: ElementRef,
    private cmsContentEditService: CmsContentEditService,
    private dialog: MatDialog,
    private cmsCommonService: CmsCommonService,
    private sidebarService: CmsSidebarService,
    private undoRedoService: UndoRedoService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.renderingData$
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        tap((data: IContentEditorComponentImage) => {
          if (!data) return;
          this.savingData = data;
          this.onLanguageSwitchHandler();
        }),
      )
      .subscribe();
    setTimeout(() => {
      this.viewRef = getRootViewRef(this) as ViewRef;
    }, 0);
    this.onCheckViewMode();
  }

  onLanguageSwitchHandler() {
    this.cmsCommonService.getCmsLanguageSwitch
      .pipe(
        takeUntil(this.destroy$),
        tap((language: ICmsLanguageSwitch) => {
          if (language) {
            this.currentCultureUI = language.cultureUI;
            this.contentEditorComponentImageLanguage = this.getContentEditorComponentImageLanguage(language.cultureUI, this.cmsCommonService.defaultCultureUI);
            if (this.onFocus) this.setLayoutImageDataToFormValue();
          }
        }),
      )
      .subscribe();
  }

  getContentEditorComponentImageLanguage(cultureUI: EnumLanguageCultureUI, defaultCultureUI: EnumLanguageCultureUI): IContentEditorComponentImageLanguage {
    this.savingData.option.language = this.savingData.option.language as IContentEditorComponentImageLanguage[];
    const defaultContentEditorComponentImageLanguage = this.savingData.option.language.find((lang) => lang.cultureUI === defaultCultureUI);
    if (!defaultContentEditorComponentImageLanguage) {
      this.savingData.option.language[0].cultureUI = defaultCultureUI;
    }
    let contentEditorComponentImageLanguage = this.savingData.option.language.find((lang) => lang.cultureUI === cultureUI);
    if (!contentEditorComponentImageLanguage) {
      const language = deepCopy(defaultContentEditorComponentImageLanguage);
      language.cultureUI = cultureUI;
      this.savingData.option.language.push(language);
      contentEditorComponentImageLanguage = language;
    }
    return contentEditorComponentImageLanguage;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  onCheckViewMode(): void {
    if (this.router.url.includes('cms/edit/site-management')) this.isViewMode = true;
  }

  onFocusEvent(): void {
    if (this.onFocus) return;
    this.onFocusComponent(this);
    this.sidebarService.setSidebarLayoutMode(null);
    this.onNavigate(null);
    setTimeout(() => {
      this.sidebarService.setSidebarLayoutMode(ESidebarMode.LAYOUT_SETTING_IMAGE);
      this.setLayoutImageDataToFormValue();
    }, 0);
  }

  onFocusComponent(component: CmsContentImageRenderingComponent): void {
    if (this !== component) return;
    this.cmsContentEditService.onFocusCurrentComponent(this);
    this.setFormValueToLayoutImageData();
  }

  saveLayoutImageData(): void {
    this.sidebarService.setLayoutImageValue(null);
  }

  setFormValueToLayoutImageData(): void {
    if (this.layoutImageSubscription) return;
    this.layoutImageSubscription = this.sidebarService.getLayoutImageValue
      .pipe(
        startWith(this.savingData),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        pairwise(),
        tap(([oldValue, newVaLue]: [IContentEditorComponentImageOption, IContentEditorComponentImageOption]) => {
          if (!oldValue) return;
          if (stringify(oldValue) !== stringify(newVaLue) && newVaLue) {
            const newVaLueLanguage = newVaLue.language as IContentEditorComponentImageLanguage;
            this.savingData.option.captionType = newVaLue.captionType;
            this.savingData.option.isCaption = newVaLue.isCaption;
            this.savingData.option.imgUrl = newVaLue.imgUrl;
            this.savingData.option.language = this.savingData.option.language as IContentEditorComponentImageLanguage[];
            const index = this.savingData.option.language.findIndex((lang) => lang.cultureUI === newVaLueLanguage.cultureUI);
            this.savingData.option.language[index] = newVaLueLanguage;
            this.contentEditorComponentImageLanguage = this.getContentEditorComponentImageLanguage(newVaLueLanguage.cultureUI, this.cmsCommonService.defaultCultureUI);
          }
        }),
      )
      .subscribe();
  }

  setLayoutImageDataToFormValue(): void {
    const formData = {
      captionType: this.savingData.option.captionType,
      isCaption: this.savingData.option.isCaption,
      imgUrl: this.savingData.option.imgUrl,
      language: this.contentEditorComponentImageLanguage,
    } as IContentEditorComponentImageOption;
    this.sidebarService.setLayoutImageFormValue(formData);
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
