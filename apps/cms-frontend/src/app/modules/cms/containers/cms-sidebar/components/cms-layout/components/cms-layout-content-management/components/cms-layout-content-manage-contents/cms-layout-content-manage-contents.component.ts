import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { EContentSortBy, IContentManagementContents, IDropDown } from '@reactor-room/cms-models-lib';
import { CmsContentManagementRenderingComponent } from 'apps/cms-frontend/src/app/modules/cms/components/cms-rendering-component/cms-content-management-rendering/cms-content-management-rendering.component';
import { ContentManagementContents } from 'apps/cms-frontend/src/app/modules/cms/modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsEditService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-edit.service';
import { CmsSidebarService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-sidebar.service';
import { UndoRedoService } from 'apps/cms-frontend/src/app/services/undo-redo.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, pairwise, startWith, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'cms-next-cms-layout-content-manage-contents',
  templateUrl: './cms-layout-content-manage-contents.component.html',
  styleUrls: ['./cms-layout-content-manage-contents.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class CmsLayoutContentManageContentsComponent implements OnInit, OnDestroy, AfterViewInit {
  parentForm: FormGroup;
  destroy$ = new Subject();
  contentManagementContentsForm: FormGroup;
  toggleAdvanceSetting = false;
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
  ) {}

  ngOnInit(): void {
    this.contentManagementContentsForm = this.getContentManagementContentsFormGroup();
    this.parentForm = this.parentFormDirective.form;
    this.parentForm.addControl('contents', this.contentManagementContentsForm);
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    this.sidebarService.getContentManageContentsFormValue.pipe(distinctUntilChanged()).subscribe((contentManageContentsValue: IContentManagementContents) => {
      if (contentManageContentsValue) {
        this.contentManagementContentsForm.patchValue(contentManageContentsValue);
        const categoriesFormArray = this.contentManagementContentsForm.get('categoryIds') as FormArray;
        categoriesFormArray.clear();
        contentManageContentsValue.categoryIds.forEach((categoryId) => {
          const formControl = new FormControl(categoryId);
          categoriesFormArray.push(formControl);
        });
      }
    });
    this.onContentManageContentsFormValueChange();
  }

  onContentManageContentsFormValueChange(): void {
    this.contentManagementContentsForm.valueChanges
      .pipe(
        startWith(this.contentManagementContentsForm.value),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        debounceTime(100),
        tap((value) => {
          if (value) this.sidebarService.setContentManageContentsValue(value);
        }),
        pairwise(),
      )
      .subscribe(([oldValue, newValue]) => {
        if (newValue) {
          const contentManageContents: ContentManagementContents = {
            ...oldValue,
            component: this.cmsEditService.currentComponent as CmsContentManagementRenderingComponent,
          };
          if (!newValue.component) {
            this.undoRedoService.addContentManageContents(contentManageContents);
          }
        }
      });
  }

  getContentManagementContentsFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      categoryIds: this.fb.array([]),
      contentSortBy: [EContentSortBy.PUBLISH_DATE],
      isPinContentFirst: [true],
      isShortDescription: [true],
      isView: [true],
      isPublishedDate: [true],
      isShare: [true],
      component: null,
      contentManagementContents: [''],
    });
    return formGroup;
  }

  categoryIdsEvent(event: string[]) {
    const categoriesFormArray = this.contentManagementContentsForm.get('categoryIds') as FormArray;
    categoriesFormArray.clear();
    event.forEach((categoryId) => {
      const formControl = new FormControl(categoryId);
      categoriesFormArray.push(formControl);
    });
  }

  onToggleAdvanceSetting(): void {
    this.toggleAdvanceSetting = !this.toggleAdvanceSetting;
  }
}
