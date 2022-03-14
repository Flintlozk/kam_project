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
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { EContentEditorComponentType, EContentSectionType, IContentEditorSection, IDropDown } from '@reactor-room/cms-models-lib';
import { ConfirmDialogComponent } from 'apps/cms-frontend/src/app/components/dialog-theme/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogModel, ConfirmDialogType } from 'apps/cms-frontend/src/app/components/dialog-theme/confirm-dialog/confirm-dialog.model';
import { Children, getRootViewRef } from 'apps/cms-frontend/src/app/shares/utils';
import { Subject } from 'rxjs';
import { distinctUntilChanged, startWith, takeUntil } from 'rxjs/operators';
import { CmsContentEditService } from '../../../../services/cms-content-edit.service';
import { CmsContentColumnRenderingComponent } from '../cms-content-column-rendering/cms-content-column-rendering.component';

@Component({
  selector: 'cms-next-cms-content-section-rendering',
  templateUrl: './cms-content-section-rendering.component.html',
  styleUrls: ['./cms-content-section-rendering.component.scss'],
  providers: [{ provide: Children, useExisting: forwardRef(() => CmsContentSectionRenderingComponent) }],
})
export class CmsContentSectionRenderingComponent implements OnInit, AfterContentInit, OnDestroy {
  @ViewChild('columnPoint', { static: true, read: ViewContainerRef }) columnPoint: ViewContainerRef;
  sectionPoint: ViewContainerRef;
  @ContentChildren(Children) public columnChildren!: QueryList<CmsContentColumnRenderingComponent>;
  sectionChildren: QueryList<CmsContentSectionRenderingComponent>;
  componentType = EContentEditorComponentType.SECTION;
  viewRef: ViewRef;
  onFocus = false;
  sectionVariationForm: FormGroup;
  isChildEnter = false;
  renderingData$ = new Subject<IContentEditorSection>();
  destroy$ = new Subject();
  savingData: IContentEditorSection = {
    type: EContentSectionType.FR_1,
    gap: 0,
    columns: null,
  };
  sectionStatus = false;
  sectionStyle: IDropDown[] = [
    {
      title: '100',
      value: EContentSectionType.FR_1,
    },
    {
      title: '50 / 50',
      value: EContentSectionType.FR_1_1,
    },
    {
      title: '30 / 70',
      value: EContentSectionType.FR_3_7,
    },
    {
      title: '70 / 30',
      value: EContentSectionType.FR_7_3,
    },
    {
      title: '33 / 33 / 33',
      value: EContentSectionType.FR_1_1_1,
    },
    {
      title: '25 / 50 / 25',
      value: EContentSectionType.FR_1_2_1,
    },
  ];
  EContentSectionType = EContentSectionType;
  isViewMode = false;

  constructor(
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    public el: ElementRef,
    private cmsContentEditService: CmsContentEditService,
    private dialog: MatDialog,
    private fb: FormBuilder,
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
    this.sectionVariationForm = this.getsectionVariationFormGroup();
    this.sectionVariationForm
      .get('gap')
      .valueChanges.pipe(takeUntil(this.destroy$), distinctUntilChanged(), startWith(this.sectionVariationForm.get('gap').value))
      .subscribe((val) => {
        this.savingData.gap = val;
      });
    this.onCheckViewMode();
  }

  onCheckViewMode(): void {
    if (this.router.url.includes('cms/edit/site-management')) this.isViewMode = true;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  getsectionVariationFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      type: [EContentSectionType.FR_1],
      gap: [0],
    });
    return formGroup;
  }

  ngAfterContentInit(): void {
    this.columnChildren.forEach((c, i) => {
      const rootViewRef = getRootViewRef(c) as ViewRef;
      c.columnPoint = this.columnPoint;
      c.columnChildren = this.columnChildren;
      this.columnPoint.move(rootViewRef, i);
    });
  }

  onColumnHandler(innitData: IContentEditorSection): void {
    this.savingData.type = innitData.type;
    this.savingData.gap = innitData.gap;
    switch (innitData.type) {
      case EContentSectionType.FR_1:
        this.onCreateNewColumn();
        break;
      case EContentSectionType.FR_1_1:
      case EContentSectionType.FR_3_7:
      case EContentSectionType.FR_7_3:
        this.onCreateNewColumn();
        this.onCreateNewColumn();
        break;
      case EContentSectionType.FR_1_1_1:
      case EContentSectionType.FR_1_2_1:
        this.onCreateNewColumn();
        this.onCreateNewColumn();
        this.onCreateNewColumn();
        break;
      default:
        this.onCreateNewColumn();
        break;
    }
  }

  onCreateNewColumn(): void {
    const componentRef = this.createComponent<CmsContentColumnRenderingComponent>(CmsContentColumnRenderingComponent);
    componentRef.instance.columnPoint = this.columnPoint;
    componentRef.instance.columnChildren = this.columnChildren;
    this.moveViewRefTo(this.columnPoint, componentRef.hostView, this.columnPoint?.length);
    this.columnChildren.reset([...this.columnChildren.toArray(), componentRef.instance]);
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

  onFocusComponent(component: CmsContentSectionRenderingComponent): void {
    if (this !== component) return;
    this.cmsContentEditService.onFocusCurrentComponent(this);
  }

  onNavigate(key: string): void {
    this.cmsContentEditService.onNavigate(this.sectionPoint, this.sectionChildren, this.viewRef, key, this.el);
  }

  onAddNewColumn(): void {
    this.onCreateNewColumn();
  }

  onToggleSectionStatus(): void {
    this.sectionStatus = !this.sectionStatus;
    this.sectionVariationForm.patchValue(this.savingData);
  }

  onChangeSectionOption(type: EContentSectionType): void {
    this.sectionVariationForm.get('type').patchValue(type);
    this.savingData.type = this.sectionVariationForm.get('type').value;
    this.savingData.gap = this.sectionVariationForm.get('gap').value;
    this.onToggleSectionStatus();
  }

  onRemoveSection(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        type: ConfirmDialogType.DANGER,
        title: 'Delete Section Confirmation',
        content: 'Are you sure to delete this section?',
      } as ConfirmDialogModel,
    });
    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: boolean) => {
        if (result) {
          this.cmsContentEditService.onRemoveComponent(this.sectionPoint, this.sectionChildren, this.viewRef);
        }
      });
  }

  mouseEnterEvent(): void {
    this.isChildEnter = true;
  }

  mouseLeaveEvent(): void {
    this.isChildEnter = false;
  }
}
