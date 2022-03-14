import {
  AfterContentInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ContentChildren,
  Injector,
  OnInit,
  QueryList,
  Type,
  ViewChild,
  ViewContainerRef,
  ViewRef,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { EContentEditorComponentType, EContentSectionType, IContentEditor, IContentEditorComponent, IDropDown, IThemeSharingComponentConfig } from '@reactor-room/cms-models-lib';
import { Children, getRootViewRef } from 'apps/cms-frontend/src/app/shares/utils';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { CmsContentEditService } from '../../../../services/cms-content-edit.service';
import { CmsEditThemeService } from '../../../../services/cms-theme.service';
import { WebsiteService } from '../../../../services/website.service';
import { CmsContentSectionRenderingComponent } from '../cms-content-section-rendering/cms-content-section-rendering.component';

@Component({
  selector: 'cms-next-cms-content-editor-rendering',
  templateUrl: './cms-content-editor-rendering.component.html',
  styleUrls: ['./cms-content-editor-rendering.component.scss'],
})
export class CmsContentEditorRenderingComponent implements OnInit, AfterContentInit {
  @ContentChildren(Children) public sectionChildren!: QueryList<CmsContentSectionRenderingComponent>;
  @ViewChild('sectionPoint', { static: true, read: ViewContainerRef }) sectionPoint: ViewContainerRef;
  componentType = EContentEditorComponentType.CONTAINER;
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
  sectionVariationForm: FormGroup;
  EContentSectionType = EContentSectionType;
  destroy$ = new Subject();
  isViewMode = false;

  constructor(
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private cmsContentEditService: CmsContentEditService,
    private fb: FormBuilder,
    private websiteService: WebsiteService,
    private cmsThemeService: CmsEditThemeService,
    private router: Router,
  ) {
    this.sectionVariationForm = this.getsectionVariationFormGroup();
  }

  ngOnInit(): void {
    this.onCheckViewMode();
  }

  onCheckViewMode(): void {
    if (this.router.url.includes('cms/edit/site-management')) this.isViewMode = true;
  }

  getsectionVariationFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      type: [EContentSectionType.FR_1],
      gap: [20],
    });
    return formGroup;
  }

  ngAfterContentInit(): void {
    this.sectionChildren.forEach((c, i) => {
      const rootViewRef = getRootViewRef(c) as ViewRef;
      c.sectionPoint = this.sectionPoint;
      c.sectionChildren = this.sectionChildren;
      this.sectionPoint.move(rootViewRef, i);
    });
    this.cmsContentEditService.sectionChildren = this.sectionChildren;
    const sharingThemeConfig$ = this.websiteService.$sharingThemeConfig;
    sharingThemeConfig$
      .pipe(
        takeUntil(this.destroy$),
        tap((themeConfig: IThemeSharingComponentConfig) => {
          if (themeConfig) {
            this.cmsThemeService.setThemeFontSetting(themeConfig.font);
            this.cmsThemeService.setThemeColorSetting(themeConfig.color);
          }
        }),
      )
      .subscribe();
    this.cmsContentEditService.$contents
      .pipe(
        takeUntil(this.destroy$),
        tap((val) => {
          if (val) {
            this.innitDataRendering(val);
          }
        }),
      )
      .subscribe();
  }

  innitDataRendering(data: IContentEditor): void {
    this.sectionChildren.forEach((section, sectionIndex) => {
      const sectionComponent = section as CmsContentSectionRenderingComponent;
      const sectionData = data.draftSections[sectionIndex];
      sectionComponent.renderingData$.next(sectionData);
      const columnChildren = sectionComponent.columnChildren;
      columnChildren.forEach((columnComponent, columnIndex) => {
        const columnData = sectionData?.columns[columnIndex];
        columnComponent.renderingData$.next(columnData);
        columnComponent.componentChildren.forEach((componentChild, componentIndex) => {
          const componentChildData = columnData?.components[componentIndex] as IContentEditorComponent;
          componentChild.renderingData$.next(componentChildData);
        });
      });
    });
  }

  onCreateNewSection(type: EContentSectionType): void {
    const componentRef = this.createComponent<CmsContentSectionRenderingComponent>(CmsContentSectionRenderingComponent);
    this.sectionVariationForm.get('type').patchValue(type);
    componentRef.instance.onColumnHandler(this.sectionVariationForm.value);
    componentRef.instance.sectionPoint = this.sectionPoint;
    componentRef.instance.sectionChildren = this.sectionChildren;
    this.moveViewRefTo(this.sectionPoint, componentRef.hostView, this.sectionPoint?.length);
    this.sectionChildren.reset([...this.sectionChildren.toArray(), componentRef.instance]);
    this.onToggleSectionStatus();
  }

  onToggleSectionStatus(): void {
    this.sectionStatus = !this.sectionStatus;
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
}
