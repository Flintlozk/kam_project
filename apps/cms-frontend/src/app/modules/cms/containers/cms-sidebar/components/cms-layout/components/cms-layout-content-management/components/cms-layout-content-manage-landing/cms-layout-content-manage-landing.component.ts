import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EContentSortBy, IContentManagementLanding, IContentManagementLandingPattern, IDropDown, RightContentType } from '@reactor-room/cms-models-lib';
import { StatusSnackbarComponent, StatusSnackbarType, StatusSnackbarModel } from '@reactor-room/itopplus-cdk';
import { CmsContentManagementRenderingComponent } from 'apps/cms-frontend/src/app/modules/cms/components/cms-rendering-component/cms-content-management-rendering/cms-content-management-rendering.component';
import { ContentManagementLanding } from 'apps/cms-frontend/src/app/modules/cms/modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsEditService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-edit.service';
import { CmsSidebarService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-sidebar.service';
import { ContentPatternsLandingService } from 'apps/cms-frontend/src/app/modules/cms/services/content-patterns-landing.service';
import { UndoRedoService } from 'apps/cms-frontend/src/app/services/undo-redo.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, pairwise, startWith, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'cms-next-cms-layout-content-manage-landing',
  templateUrl: './cms-layout-content-manage-landing.component.html',
  styleUrls: ['./cms-layout-content-manage-landing.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class CmsLayoutContentManageLandingComponent implements OnInit, OnDestroy, AfterViewInit {
  contentManagementLandingForm: FormGroup;
  parentForm: FormGroup;
  destroy$ = new Subject();
  currentLandingPattern: IContentManagementLandingPattern;
  isSelectPatterns = false;
  RightContentType = RightContentType;

  contentSortByData: IDropDown[] = [
    {
      title: 'Name',
      value: EContentSortBy.NAME,
    },
    {
      title: 'Recent Edit',
      value: EContentSortBy.RECENT_EDIT,
    },
    {
      title: 'Publish Date',
      value: EContentSortBy.PUBLISH_DATE,
    },
    {
      title: 'View',
      value: EContentSortBy.VIEW,
    },
    {
      title: 'Rating',
      value: EContentSortBy.RATING,
    },
    {
      title: 'Most Comment',
      value: EContentSortBy.MOST_COMMENT,
    },
    {
      title: 'Random',
      value: EContentSortBy.RANDOM,
    },
  ];

  constructor(
    private fb: FormBuilder,
    private parentFormDirective: FormGroupDirective,
    private sidebarService: CmsSidebarService,
    private cmsEditService: CmsEditService,
    private undoRedoService: UndoRedoService,
    private snackBar: MatSnackBar,
    private contentPatternsLanding: ContentPatternsLandingService,
  ) {}

  ngOnInit(): void {
    this.contentManagementLandingForm = this.getContentManagementLandingFormGroup();
    this.parentForm = this.parentFormDirective.form;
    this.parentForm.addControl('landing', this.contentManagementLandingForm);
  }

  ngAfterViewInit(): void {
    this.sidebarService.getContentManageLandingFormValue.pipe(distinctUntilChanged()).subscribe((contentManageLandingValue: IContentManagementLanding) => {
      if (contentManageLandingValue) {
        this.contentManagementLandingForm.patchValue(contentManageLandingValue);
        if (contentManageLandingValue._id) {
          this.onGetLandingPatternById(contentManageLandingValue._id);
        }
      }
    });
    this.onContentManageLandingFormValueChange();
  }

  onGetLandingPatternById(_id: string): void {
    this.contentPatternsLanding
      .getContentPatternsLanding(_id)
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$),
        tap((pattern) => {
          if (pattern) {
            this.currentLandingPattern = pattern;
          }
        }),
      )
      .subscribe({
        next: () => {},
        error: () => {
          this.showUnexpectedError();
        },
        complete: () => {
          console.log('COMPLETE');
        },
      });
  }

  showUnexpectedError(message: string = 'Unexpected Error occured...Try again later!'): void {
    this.snackBar.openFromComponent(StatusSnackbarComponent, {
      data: {
        type: StatusSnackbarType.ERROR,
        message,
      } as StatusSnackbarModel,
    });
  }

  onContentManageLandingFormValueChange(): void {
    this.contentManagementLandingForm.valueChanges
      .pipe(
        startWith(this.contentManagementLandingForm.value),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        debounceTime(100),
        tap((value) => {
          if (value) this.sidebarService.setContentManageLandingValue(value);
        }),
        pairwise(),
      )
      .subscribe(([oldValue, newValue]) => {
        if (newValue) {
          const contentManagementLanding: ContentManagementLanding = {
            ...oldValue,
            component: this.cmsEditService.currentComponent as CmsContentManagementRenderingComponent,
          };
          if (!newValue.component) {
            this.undoRedoService.addContentManageLanding(contentManagementLanding);
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  getContentManagementLandingFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      _id: [''],
      option: this.getContentManagementLandingOptionFormGroup(),
      component: null,
      contentManagementLanding: [''],
    });
    return formGroup;
  }
  getContentManagementLandingOptionFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      isView: [true],
      isComment: [true],
      isPublishDate: [true],
      isSocialShare: [true],
      isRightContent: [true],
      rightContent: this.getContentManagementLandingOptionRightContentFormGroup(),
    });
    return formGroup;
  }

  getContentManagementLandingOptionRightContentFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      type: [RightContentType.TYPE_1],
      title: ['Recommended'],
      categoryIds: this.fb.array([]),
      contentSortBy: [EContentSortBy.PUBLISH_DATE],
      isPinContentFirst: [true],
      isMaxItem: [false],
      maxItemNumber: [5],
      moreTitle: ['More'],
    });
    return formGroup;
  }

  categoryIdsEvent(event: string[]) {
    const categoriesFormArray = this.contentManagementLandingForm.get('option').get('rightContent').get('categoryIds') as FormArray;
    categoriesFormArray.clear();
    event.forEach((categoryId) => {
      const formControl = new FormControl(categoryId);
      categoriesFormArray.push(formControl);
    });
  }

  onRightContentPattern(type: RightContentType): void {
    this.contentManagementLandingForm.get('option').get('rightContent').get('type').patchValue(type);
  }

  onIsSelectPattern(): void {
    this.isSelectPatterns = true;
  }

  isSelectPatternsEvent(event: boolean): void {
    this.isSelectPatterns = event;
  }

  patternEvent(pattern: IContentManagementLandingPattern): void {
    if (pattern) {
      this.contentManagementLandingForm.get('_id').patchValue(pattern._id);
      this.currentLandingPattern = pattern;
    }
  }
}
