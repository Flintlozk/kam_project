import {
  AfterContentInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ContentChildren,
  ElementRef,
  forwardRef,
  Injector,
  OnDestroy,
  OnInit,
  QueryList,
  Type,
  ViewChild,
  ViewContainerRef,
  ViewRef,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import {
  contentEditorComponentEmbededDefault,
  contentEditorComponentImageDefault,
  contentEditorComponentTextDefault,
  EContentEditorComponentType,
  EnumLanguageCultureUI,
  IContentEditorColumn,
  IDropDown,
} from '@reactor-room/cms-models-lib';
import { deepCopy } from '@reactor-room/itopplus-front-end-helpers';
import { ConfirmDialogComponent } from 'apps/cms-frontend/src/app/components/dialog-theme/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogModel, ConfirmDialogType } from 'apps/cms-frontend/src/app/components/dialog-theme/confirm-dialog/confirm-dialog.model';
import { Children, getRootViewRef } from 'apps/cms-frontend/src/app/shares/utils';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, startWith, takeUntil } from 'rxjs/operators';
import { ContentChildrenComponentType } from '../../../../modules/cms-edit-mode/components/cms-edit-rendering-content/cms-edit-rendering-content.model';
import { CmsCommonService } from '../../../../services/cms-common.service';
import { CmsContentEditService } from '../../../../services/cms-content-edit.service';
import { autoCompleteFilter } from '../../../../services/domain/common.domain';
import { CmsContentEmbededRenderingComponent } from '../cms-content-embeded-rendering/cms-content-embeded-rendering.component';
import { CmsContentImageRenderingComponent } from '../cms-content-image-rendering/cms-content-image-rendering.component';
import { CmsContentTextRenderingComponent } from '../cms-content-text-rendering/cms-content-text-rendering.component';

@Component({
  selector: 'cms-next-cms-content-column-rendering',
  templateUrl: './cms-content-column-rendering.component.html',
  styleUrls: ['./cms-content-column-rendering.component.scss'],
  providers: [{ provide: Children, useExisting: forwardRef(() => CmsContentColumnRenderingComponent) }],
})
export class CmsContentColumnRenderingComponent implements OnInit, AfterContentInit, OnDestroy {
  @ViewChild('componentPoint', { static: true, read: ViewContainerRef }) componentPoint: ViewContainerRef;
  columnPoint: ViewContainerRef;
  @ContentChildren(Children) public componentChildren!: QueryList<ContentChildrenComponentType>;
  columnChildren: QueryList<CmsContentColumnRenderingComponent>;
  componentType = EContentEditorComponentType.COLUMN;
  renderingData$ = new Subject<IContentEditorColumn>();
  destroy$ = new Subject();
  savingData: IContentEditorColumn = {
    gap: 0,
    components: null,
  };
  viewRef: ViewRef;
  onFocus = false;
  isChildEnter = false;
  componentStatus = false;
  componentCreateStatus = false;
  componentVariationForm: FormGroup;
  componentList: IDropDown[] = [
    {
      value: EContentEditorComponentType.TEXT,
      title: 'Text',
      status: true,
    },
    {
      value: EContentEditorComponentType.BUTTON,
      title: 'Button',
      status: false,
    },
    {
      value: EContentEditorComponentType.EMBEDED,
      title: 'Embeded',
      status: true,
    },
    {
      value: EContentEditorComponentType.IMAGE,
      title: 'Image',
      status: true,
    },
    {
      value: EContentEditorComponentType.IMAGE_GALLERY,
      title: 'Image Gallery',
      status: false,
    },
  ];
  componentList$: Observable<IDropDown[]>;
  componentListFormControl = new FormControl('');
  EContentEditorComponentType = EContentEditorComponentType;
  defaultCultureUI: EnumLanguageCultureUI;
  isViewMode = false;
  constructor(
    public el: ElementRef,
    private cmsContentEditService: CmsContentEditService,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private cmsCommonService: CmsCommonService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.renderingData$.pipe(takeUntil(this.destroy$), distinctUntilChanged()).subscribe((data) => {
      if (!data) return;
      this.savingData = data;
    });
    setTimeout(() => {
      this.viewRef = getRootViewRef(this) as ViewRef;
    }, 0);
    this.componentVariationHandler();
    this.componentListHandler();
    this.onCheckViewMode();
  }

  onCheckViewMode(): void {
    if (this.router.url.includes('cms/edit/site-management')) this.isViewMode = true;
  }

  componentVariationHandler(): void {
    this.componentVariationForm = this.getcomponentVariationFormGroup();
    this.componentVariationForm
      .get('gap')
      .valueChanges.pipe(takeUntil(this.destroy$), distinctUntilChanged(), startWith(this.componentVariationForm.get('gap').value))
      .subscribe((val) => {
        this.savingData.gap = val;
      });
  }

  componentListHandler(): void {
    this.componentList$ = this.componentListFormControl.valueChanges.pipe(
      startWith(''),
      map((value) => autoCompleteFilter(value, this.componentList, 'object')),
    ) as Observable<IDropDown[]>;
  }

  getcomponentVariationFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      gap: [0],
    });
    return formGroup;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngAfterContentInit(): void {
    this.componentChildren.forEach((c, i) => {
      const rootViewRef = getRootViewRef(c) as ViewRef;
      c.componentPoint = this.componentPoint;
      c.componentChildren = this.componentChildren;
      this.componentPoint.move(rootViewRef, i);
    });
  }

  onCreateNewComponent(componentType: EContentEditorComponentType): void {
    let componentRef: ComponentRef<ContentChildrenComponentType> = null;
    switch (componentType) {
      case EContentEditorComponentType.TEXT:
        {
          componentRef = this.createComponent<CmsContentTextRenderingComponent>(CmsContentTextRenderingComponent);
          let component = componentRef.instance;
          component = component as CmsContentTextRenderingComponent;
          component.savingData = deepCopy(contentEditorComponentTextDefault);
          component.savingData.quillHTMLs[0].cultureUI = this.cmsCommonService.defaultCultureUI;
          component.initQuillHTML();
        }
        break;
      case EContentEditorComponentType.EMBEDED:
        {
          componentRef = this.createComponent<CmsContentEmbededRenderingComponent>(CmsContentEmbededRenderingComponent);
          let component = componentRef.instance;
          component = component as CmsContentEmbededRenderingComponent;
          component.savingData = deepCopy(contentEditorComponentEmbededDefault);
        }
        break;
      case EContentEditorComponentType.IMAGE:
        {
          componentRef = this.createComponent<CmsContentImageRenderingComponent>(CmsContentImageRenderingComponent);
          let component = componentRef.instance;
          component = component as CmsContentImageRenderingComponent;
          component.savingData = deepCopy(contentEditorComponentImageDefault);
          component.onLanguageSwitchHandler();
        }
        break;
      default:
        break;
    }
    if (componentRef) {
      componentRef.instance.componentPoint = this.componentPoint;
      componentRef.instance.componentChildren = this.componentChildren;
      this.moveViewRefTo(this.componentPoint, componentRef.hostView, this.componentPoint?.length);
      this.componentChildren.reset([...this.componentChildren.toArray(), componentRef.instance]);
    }
    this.onToggleComponentCreateStatus();
  }

  createComponent<T>(component: Type<T>): ComponentRef<T> {
    const factory = this.resolver.resolveComponentFactory<T>(component);
    const componentRef = factory.create(this.injector);
    componentRef.changeDetectorRef.detectChanges();
    return componentRef;
  }

  moveViewRefTo(vcr: ViewContainerRef, viewRef: ViewRef, to: number): void {
    vcr.move(viewRef, to);
  }

  onFocusEvent(): void {
    if (this.isChildEnter) return;
    this.onFocusComponent(this);
    this.onNavigate(null);
  }

  onFocusComponent(component: CmsContentColumnRenderingComponent): void {
    if (this !== component) return;
    this.cmsContentEditService.onFocusCurrentComponent(this);
  }

  onRemoveColumn(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        type: ConfirmDialogType.DANGER,
        title: 'Block Confirmation',
        content: 'Are you sure to delete this block?',
      } as ConfirmDialogModel,
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.cmsContentEditService.onRemoveComponent(this.columnPoint, this.columnChildren, this.viewRef);
      }
    });
  }

  onToggleComponentStatus(): void {
    this.componentStatus = !this.componentStatus;
    this.componentVariationForm.patchValue(this.savingData);
  }

  onToggleComponentCreateStatus(): void {
    this.componentCreateStatus = !this.componentCreateStatus;
  }

  mouseEnterEvent(): void {
    this.isChildEnter = true;
  }

  mouseLeaveEvent(): void {
    this.isChildEnter = false;
  }

  onNavigate(key: string): void {
    this.cmsContentEditService.onNavigate(this.columnPoint, this.columnChildren, this.viewRef, key, this.el);
  }
}
