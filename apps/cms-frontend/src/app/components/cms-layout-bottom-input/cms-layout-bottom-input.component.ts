import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { ElinkType, ICmsLayoutBottomTypes, IDropDown, OpenWindowTypes, ShoppingCartPatternBottomTypes } from '@reactor-room/cms-models-lib';
import { textDefault } from 'apps/cms-frontend/src/environments/environment';
import { Subject } from 'rxjs/internal/Subject';
import { debounceTime, distinctUntilChanged, startWith, takeUntil, tap } from 'rxjs/operators';
import {
  anchorData,
  bottomOptions,
  contentPageData,
  linkTypeData,
  pageData,
  paginationList,
  popupPageData,
  productPageData,
} from '../../modules/cms/containers/cms-sidebar/components/cms-layout/cms-layout.list';
import { CmsSidebarService } from '../../modules/cms/services/cms-sidebar.service';

@Component({
  selector: 'cms-next-cms-layout-bottom-input',
  templateUrl: './cms-layout-bottom-input.component.html',
  styleUrls: ['./cms-layout-bottom-input.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class CmsLayoutBottomInputComponent implements OnInit, OnDestroy {
  @Input() bottomFormName = 'bottomSettings';

  linkFormGroup = this.fb.group({
    linkType: [textDefault.defaultTextLinkType],
    linkValue: [],
    parentID: [],
  });

  buttonFormGroup = this.fb.group({
    name: [],
    link: this.linkFormGroup,
    openType: [textDefault.defaultOpenWindowType],
  });

  paginationFormGroup = this.fb.group({
    type: [textDefault.defaultPaginationStyle],
    position: [textDefault.defaultTextAlignment],
  });

  bottomInputForm = this.fb.group({
    options: [],
    button: this.buttonFormGroup,
    pagination: this.paginationFormGroup,
  });

  imagePath = 'assets/cms/media-style/shopping-cart/';
  bottomOptions = bottomOptions;
  paginationList = paginationList;
  shoppingCartPatternListLength: number;

  destroy$ = new Subject<void>();
  isButton: boolean;
  isPagination: boolean;
  linkTypeData: IDropDown[] = linkTypeData;
  currentLinkType: ElinkType;
  ElinkType = ElinkType;
  pageData = pageData;
  productPageData = productPageData;
  contentPageData = contentPageData;
  popupPageData = popupPageData;
  anchorData = anchorData;
  OpenWindowTypes = OpenWindowTypes;
  parentForm: FormGroup;

  constructor(private fb: FormBuilder, private sidebarService: CmsSidebarService, private parentFormDirective: FormGroupDirective) {}

  ngOnInit(): void {
    this.setUpForm();
    this.subscribeToFormChanges();
    this.setPaginationType();
    this.currentLinkType = this.linkFormGroup.get('linkType').value;
  }

  setUpForm(): void {
    this.parentForm = this.parentFormDirective.form;
    this.parentForm.addControl(this.bottomFormName, this.bottomInputForm);
  }

  subscribeToFormChanges(): void {
    this.bottomInputForm.valueChanges
      .pipe(
        startWith(this.parentForm.get('advanceSetting').value),
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        debounceTime(100),
        tap((bottomValues: ICmsLayoutBottomTypes) => {
          const { options } = bottomValues;
          this.showHideOptions(options);
        }),
      )
      .subscribe();
  }

  showHideOptions(options: ShoppingCartPatternBottomTypes) {
    if (options === ShoppingCartPatternBottomTypes.BUTTON) {
      this.isButton = true;
      this.isPagination = false;
    } else if (options === ShoppingCartPatternBottomTypes.PAGINATION) {
      this.isButton = false;
      this.isPagination = true;
    } else {
      this.isButton = false;
      this.isPagination = false;
    }
  }

  onLinkTypeChange(event: MatSelectChange): void {
    this.currentLinkType = event.value;
    this.bottomInputForm.get('link').get('linkValue').patchValue('');
  }

  setPaginationType(): void {
    this.paginationList.forEach((pagination) => (pagination.selected = false));
    const paginationValue = this.paginationFormGroup.get('type').value;
    this.paginationList.find((pagination) => pagination.type === paginationValue).selected = true;
  }

  onPaginationSelect(index: number): void {
    this.paginationList.forEach((align) => (align.selected = false));
    this.paginationList[index].selected = true;
    const paginationFormGroup = this.paginationFormGroup.get('type');
    paginationFormGroup.patchValue(this.paginationList[index].type);
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
