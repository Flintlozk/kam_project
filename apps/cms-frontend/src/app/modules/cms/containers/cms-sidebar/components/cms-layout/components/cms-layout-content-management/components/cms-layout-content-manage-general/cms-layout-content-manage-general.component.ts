import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import {
  EContentManagementGeneralBottomPaginationType,
  EContentManagementGeneralBottomType,
  EContentManagementGeneralDisplay,
  ElinkType,
  ElinkTypeTitle,
  ETextAlignment,
  IContentManagementGeneral,
  IContentManagementGeneralDisplayTab,
  IContentManagementGeneralDisplayLink,
  IDropDown,
} from '@reactor-room/cms-models-lib';
// eslint-disable-next-line max-len
import { CmsContentManagementRenderingComponent } from '../../../../../../../../components/cms-rendering-component/cms-content-management-rendering/cms-content-management-rendering.component';
import { ContentManagementGeneral } from 'apps/cms-frontend/src/app/modules/cms/modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsEditService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-edit.service';
import { CmsSidebarService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-sidebar.service';
import { UndoRedoService } from 'apps/cms-frontend/src/app/services/undo-redo.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, pairwise, startWith, takeUntil, tap } from 'rxjs/operators';
import { ContentPatternsService } from 'apps/cms-frontend/src/app/modules/cms/services/content-patterns.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StatusSnackbarComponent, StatusSnackbarType, StatusSnackbarModel } from '@reactor-room/itopplus-cdk';

@Component({
  selector: 'cms-next-cms-layout-content-manage-general',
  templateUrl: './cms-layout-content-manage-general.component.html',
  styleUrls: ['./cms-layout-content-manage-general.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class CmsLayoutContentManageGeneralComponent implements OnInit, OnDestroy, AfterViewInit {
  linkTypeData: IDropDown[] = [
    {
      value: ElinkType.URL,
      title: ElinkTypeTitle.URL,
    },
    {
      value: ElinkType.PAGE,
      title: ElinkTypeTitle.PAGE,
    },
    {
      value: ElinkType.PRODUCT,
      title: ElinkTypeTitle.PRODUCT,
    },
    {
      value: ElinkType.CONTENT,
      title: ElinkTypeTitle.CONTENT,
    },
    {
      value: ElinkType.POPUP,
      title: ElinkTypeTitle.POPUP,
    },
    {
      value: ElinkType.ANCHOR,
      title: ElinkTypeTitle.ANCHOR,
    },
    {
      value: ElinkType.EMAIL,
      title: ElinkTypeTitle.EMAIL,
    },
  ];
  pageData = [
    {
      value: 'Home',
      title: 'Home',
    },
    {
      value: 'Contact us',
      title: 'Contact us',
    },
    {
      value: 'About us',
      title: 'About us',
    },
  ];
  productPageData = [
    {
      value: 'Product Home',
      title: 'Product Home',
    },
    {
      value: 'Product 1',
      title: 'Product 1',
    },
    {
      value: 'Product 2',
      title: 'Product 2',
    },
  ];
  contentPageData = [
    {
      value: 'Content 1',
      title: 'Content 1',
    },
    {
      value: 'Content 2',
      title: 'Content 2',
    },
    {
      value: 'Content 3',
      title: 'Content 3',
    },
  ];
  popupPageData = [
    {
      value: 'Popup 1',
      title: 'Popup 1',
    },
    {
      value: 'Popup 2',
      title: 'Popup 2',
    },
    {
      value: 'Popup 3',
      title: 'Popup 3',
    },
  ];
  anchorData = [
    {
      value: 'Anchor 1',
      title: 'Anchor 1',
    },
    {
      value: 'Anchor 2',
      title: 'Anchor 2',
    },
    {
      value: 'Anchor 3',
      title: 'Anchor 3',
    },
  ];
  ElinkType = ElinkType;
  contentManagementGeneralForm: FormGroup;
  parentForm: FormGroup;
  destroy$ = new Subject();
  isSelectPatterns = false;
  toggleAdvanceSetting = false;
  EContentManagementGeneralDisplay = EContentManagementGeneralDisplay;
  EContentManagementGeneralBottomType = EContentManagementGeneralBottomType;
  EContentManagementGeneralBottomPaginationType = EContentManagementGeneralBottomPaginationType;
  ETextAlignment = ETextAlignment;
  constructor(
    private fb: FormBuilder,
    private parentFormDirective: FormGroupDirective,
    private sidebarService: CmsSidebarService,
    private cmsEditService: CmsEditService,
    private undoRedoService: UndoRedoService,
    private contentPatternService: ContentPatternsService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.contentManagementGeneralForm = this.getContentManagementGeneralFormGroup();
    this.parentForm = this.parentFormDirective.form;
    this.parentForm.addControl('general', this.contentManagementGeneralForm);
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    this.sidebarService.getContentManageGeneralFormValue.pipe(distinctUntilChanged()).subscribe((contentManageGeneralValue: IContentManagementGeneral) => {
      if (contentManageGeneralValue) {
        this.contentManagementGeneralForm.patchValue(contentManageGeneralValue);
        this.onGenerateGeneralDisplayForm(contentManageGeneralValue);
        this.onGenerateGeneralBottomForm(contentManageGeneralValue);
      }
    });
    this.onContentManageGeneralFormValueChange();
  }

  onGenerateGeneralDisplayForm(contentManageGeneralValue: IContentManagementGeneral): void {
    const advanceFormGroup = this.contentManagementGeneralForm.get('advance') as FormGroup;
    const displayValue = contentManageGeneralValue.advance.display;
    switch (contentManageGeneralValue.advance.display.displayType) {
      case EContentManagementGeneralDisplay.TAB:
        {
          advanceFormGroup.setControl('display', this.getContentManagementGeneralDisplayTabFormGroup());
          const displayForm = advanceFormGroup.get('display') as FormGroup;
          const formarray = displayForm.get('array') as FormArray;
          formarray.clear();
          const display = displayValue as IContentManagementGeneralDisplayTab;
          display.array.forEach((item) => {
            const displayFormGroup = this.getContentManagementGeneralDisplayTabLinkArrayFormGroup();
            displayFormGroup.patchValue(item);
            formarray.push(displayFormGroup);
          });
        }
        break;
      case EContentManagementGeneralDisplay.LINK: {
        advanceFormGroup.setControl('display', this.getContentManagementGeneralDisplayLinkFormGroup());
        const displayForm = advanceFormGroup.get('display') as FormGroup;
        const formarray = displayForm.get('array') as FormArray;
        formarray.clear();
        const display = displayValue as IContentManagementGeneralDisplayLink;
        display.array.forEach((item) => {
          const displayFormGroup = this.getContentManagementGeneralDisplayTabLinkArrayFormGroup();
          displayFormGroup.patchValue(item);
          formarray.push(displayFormGroup);
        });
        break;
      }
      case EContentManagementGeneralDisplay.NONE: {
        advanceFormGroup.setControl('display', this.getContentManagementGeneralDisplayNoneFormGroup());
        break;
      }
      default:
        break;
    }
    advanceFormGroup.get('display').patchValue(displayValue);
  }

  onGenerateGeneralBottomForm(contentManageGeneralValue: IContentManagementGeneral): void {
    const advanceFormGroup = this.contentManagementGeneralForm.get('advance') as FormGroup;
    switch (contentManageGeneralValue.advance.bottom.bottomType) {
      case EContentManagementGeneralBottomType.BUTTON:
        advanceFormGroup.setControl('bottom', this.getContentManagementGeneralAdvanceBottomButtonFormGroup());
        break;
      case EContentManagementGeneralBottomType.PAGINATION:
        advanceFormGroup.setControl('bottom', this.getContentManagementGeneralAdvanceBottomPaginationFormGroup());
        break;
      case EContentManagementGeneralBottomType.NONE:
        advanceFormGroup.setControl('bottom', this.getContentManagementGeneralAdvanceBottomNoneFormGroup());
        break;
      default:
        break;
    }
    advanceFormGroup.get('bottom').patchValue(contentManageGeneralValue.advance.bottom);
  }

  patternIdEvent(_id: string): void {
    if (_id) {
      this.contentPatternService
        .getContentPattern(_id)
        .pipe(
          takeUntil(this.destroy$),
          tap((pattern) => {
            if (pattern) {
              this.contentManagementGeneralForm.get('pattern').patchValue(pattern);
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
  }

  showUnexpectedError(message: string = 'Unexpected Error occured...Try again later!'): void {
    this.snackBar.openFromComponent(StatusSnackbarComponent, {
      data: {
        type: StatusSnackbarType.ERROR,
        message,
      } as StatusSnackbarModel,
    });
  }

  onContentManageGeneralFormValueChange(): void {
    this.contentManagementGeneralForm.valueChanges
      .pipe(
        startWith(this.contentManagementGeneralForm.value),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        debounceTime(100),
        tap((value) => {
          if (value) this.sidebarService.setContentManageGeneralValue(value);
        }),
        pairwise(),
      )
      .subscribe(([oldValue, newValue]) => {
        if (newValue) {
          const contentManageGeneral: ContentManagementGeneral = {
            ...oldValue,
            component: this.cmsEditService.currentComponent as CmsContentManagementRenderingComponent,
          };
          if (!newValue.component) {
            this.undoRedoService.addContentManageGeneral(contentManageGeneral);
          }
        }
      });
  }

  getContentManagementGeneralFormGroup(): FormGroup {
    const contentManagementGeneralFormGroup = this.fb.group({
      pattern: this.getContentManagementGeneralPatternFormGroup(),
      advance: this.getContentManagementGeneralAdvanceFormGroup(),
      component: null,
      contentManagementGeneral: [''],
    });
    return contentManagementGeneralFormGroup;
  }

  getContentManagementGeneralAdvanceFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      display: [''],
      isContentGroup: [false],
      bottom: [''],
    });
    return formGroup;
  }

  getContentManagementGeneralDisplayNoneFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      displayType: [EContentManagementGeneralDisplay.NONE],
    });
    return formGroup;
  }

  getContentManagementGeneralDisplayTabFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      displayType: [EContentManagementGeneralDisplay.TAB],
      array: this.fb.array([]),
    });
    return formGroup;
  }

  getContentManagementGeneralDisplayLinkFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      displayType: [EContentManagementGeneralDisplay.LINK],
      displayTitle: [''],
      array: this.fb.array([]),
    });
    return formGroup;
  }

  getContentManagementGeneralDisplayTabLinkArrayFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      title: [''],
      value: [''],
    });
    return formGroup;
  }

  getContentManagementGeneralAdvanceBottomNoneFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      bottomType: [EContentManagementGeneralBottomType.NONE],
    });
    return formGroup;
  }

  getContentManagementGeneralAdvanceBottomButtonFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      bottomType: [EContentManagementGeneralBottomType.BUTTON],
      name: ['More'],
      link: this.getContentManagementGeneralAdvanceBottomButtonLinkFormGroup(),
      isNewWindow: [false],
    });
    return formGroup;
  }

  getContentManagementGeneralAdvanceBottomButtonLinkFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      linkType: [ElinkType.URL],
      linkValue: [''],
      parentID: [''],
    });
    return formGroup;
  }

  getContentManagementGeneralAdvanceBottomPaginationFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      bottomType: [EContentManagementGeneralBottomType.PAGINATION],
      type: [EContentManagementGeneralBottomPaginationType.TYPE_1],
      position: [ETextAlignment.LEFT],
    });
    return formGroup;
  }

  getContentManagementGeneralPatternFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      _id: [''],
      patternName: ['Sample Name'],
      patternUrl: [''],
      patternStyle: this.getContentManagementGeneralPatternStyleFormGroup(),
      component: null,
      contentManagementGeneral: [''],
    });
    return formGroup;
  }

  getContentManagementGeneralPatternStyleFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      container: this.getContentManagementGeneralPaternGridFormGroup(),
      primary: this.getContentManagementGeneralPaternItemFormGroup(),
      secondary: this.getContentManagementGeneralPaternItemFormGroup(),
      css: [''],
    });
    return formGroup;
  }

  getContentManagementGeneralPaternItemFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      maxContent: [0],
      grid: this.getContentManagementGeneralPaternGridFormGroup(),
      status: [true],
    });
    return formGroup;
  }

  getContentManagementGeneralPaternGridFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      gridTemplateColumns: [''],
      gridTemplateRows: [''],
      gridGap: [''],
    });
    return formGroup;
  }

  onIsSelectPattern(): void {
    this.isSelectPatterns = true;
  }

  isSelectPatternsEvent(event: boolean): void {
    this.isSelectPatterns = event;
  }

  onToggleAdvanceSetting(): void {
    this.toggleAdvanceSetting = !this.toggleAdvanceSetting;
  }

  onAdjustMaxContent(formControlName: string, key: string): void {
    const currentMaxFormControl = this.contentManagementGeneralForm['controls']['pattern']['controls']['patternStyle']['controls'][formControlName]['controls'][
      'maxContent'
    ] as FormControl;
    if (key === 'up') {
      currentMaxFormControl.patchValue(currentMaxFormControl.value + 1);
    } else {
      if (currentMaxFormControl.value > 0) {
        currentMaxFormControl.patchValue(currentMaxFormControl.value - 1);
      }
    }
  }
  onToggleDisplayType(displayType: EContentManagementGeneralDisplay): void {
    const advanceFormGroup = this.contentManagementGeneralForm.get('advance') as FormGroup;
    switch (displayType) {
      case EContentManagementGeneralDisplay.TAB:
        advanceFormGroup.setControl('display', this.getContentManagementGeneralDisplayTabFormGroup());
        break;
      case EContentManagementGeneralDisplay.LINK:
        advanceFormGroup.setControl('display', this.getContentManagementGeneralDisplayLinkFormGroup());
        break;
      case EContentManagementGeneralDisplay.NONE:
        advanceFormGroup.setControl('display', this.getContentManagementGeneralDisplayNoneFormGroup());
        break;
      default:
        break;
    }
  }

  onToggleBottomType(bottomType: EContentManagementGeneralBottomType): void {
    const advanceFormGroup = this.contentManagementGeneralForm.get('advance') as FormGroup;
    switch (bottomType) {
      case EContentManagementGeneralBottomType.BUTTON:
        advanceFormGroup.setControl('bottom', this.getContentManagementGeneralAdvanceBottomButtonFormGroup());
        break;
      case EContentManagementGeneralBottomType.PAGINATION:
        advanceFormGroup.setControl('bottom', this.getContentManagementGeneralAdvanceBottomPaginationFormGroup());
        break;
      case EContentManagementGeneralBottomType.NONE:
        advanceFormGroup.setControl('bottom', this.getContentManagementGeneralAdvanceBottomNoneFormGroup());
        break;
      default:
        break;
    }
  }

  onRemoveDisplayTab(index: number): void {
    const arrayForm = this.contentManagementGeneralForm.get('advance').get('display').get('array') as FormArray;
    arrayForm.removeAt(index);
  }

  onAddDisplayTab(): void {
    const arrayForm = this.contentManagementGeneralForm.get('advance').get('display').get('array') as FormArray;
    arrayForm.push(this.getContentManagementGeneralDisplayTabLinkArrayFormGroup());
  }

  onRemoveDisplayLink(index: number): void {
    const arrayForm = this.contentManagementGeneralForm.get('advance').get('display').get('array') as FormArray;
    arrayForm.removeAt(index);
  }

  onAddDisplayLink(): void {
    const arrayForm = this.contentManagementGeneralForm.get('advance').get('display').get('array') as FormArray;
    arrayForm.push(this.getContentManagementGeneralDisplayTabLinkArrayFormGroup());
  }

  onLinkTypeChange(): void {
    this.contentManagementGeneralForm.get('advance').get('bottom').get('link').get('linkValue').patchValue('');
  }

  onActiveBottomPagination(type: EContentManagementGeneralBottomPaginationType): void {
    this.contentManagementGeneralForm.get('advance').get('bottom').get('type').patchValue(type);
  }

  onBottomPaginationPosition(position: ETextAlignment): void {
    this.contentManagementGeneralForm.get('advance').get('bottom').get('position').patchValue(position);
  }
}
