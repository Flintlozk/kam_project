import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ICategory, IWebsiteConfigGeneralLanguage } from '@reactor-room/cms-models-lib';
import { StatusSnackbarModel, StatusSnackbarType } from '@reactor-room/itopplus-cdk';
import { IHTTPResult } from '@reactor-room/model-lib';
import { SettingWebsiteService } from 'apps/cms-frontend/src/app/services/setting-webiste.service';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { ContentCategoryService } from '../../../../../services/content-management/category.service';
import { EHeadLabels } from '../../../content-management.model';

@Component({
  selector: 'cms-next-content-sub-category-dialog',
  templateUrl: './content-sub-category-dialog.component.html',
  styleUrls: ['./content-sub-category-dialog.component.scss'],
})
export class ContentSubCategoryDialogComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject();
  subCategoryForm: FormGroup;
  languagesArray = [];
  isCategory = false;
  formData: ICategory;
  selectedIndex = 0;
  headLabel: string;
  selectedParentId = null;
  constructor(
    public dialogRef: MatDialogRef<ContentSubCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public catData,
    private fb: FormBuilder,
    public contentCategoryService: ContentCategoryService,
    private configGeneralService: SettingWebsiteService,
  ) {}
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }
  ngOnInit(): void {
    this.formData = this.catData.data || null;
    if (this.catData.mode === 'EDIT') {
      if (this.formData.parentId === null) {
        this.selectedParentId = null;
        this.headLabel = EHeadLabels.EDIT_CATEGORY;
        this.isCategory = true;
      } else {
        this.selectedParentId = this.catData.data.parentId;
        this.headLabel = EHeadLabels.EDIT_SUB_CATEGORY;
      }
      this.setUpFormControl(this.formData?.name || '');
    } else {
      this.selectedParentId = this.catData.data._id || null;
      this.headLabel = EHeadLabels.CREATE_SUB_CATEGORY;
      this.setUpFormControl('');
    }
    this.getConfigLanguages();
  }
  setUpFormControl(value = ''): void {
    this.subCategoryForm = this.fb.group({
      title: [value || '', Validators.required],
      languages: this.fb.array([]),
    });
  }
  get languagesForm() {
    return this.subCategoryForm.controls['languages'] as FormArray;
  }
  getConfigLanguages() {
    this.configGeneralService
      .getConfigGeneralLanguage()
      .pipe(
        takeUntil(this.destroy$),
        tap((res) => {
          if (res) {
            this.setUpLanguageForm(res);
          } else this.closeDialogAndSetUpSnackBar(StatusSnackbarType.ERROR, 'Error in getting language Config');
        }),
      )
      .subscribe();
  }
  setUpLanguageForm(data: IWebsiteConfigGeneralLanguage): void {
    let index = 0;
    this.languagesArray.push({
      name: data.defaultCultureUI,
      icon: `assets/lang/${data.defaultCultureUI.toLowerCase()}.svg`,
    });
    this.addSubCategory(data.defaultCultureUI, index, true);
    data.selectedCultureUIs.forEach((currentItem) => {
      index += 1;
      this.languagesArray.push({
        name: currentItem,
        icon: `assets/lang/${currentItem.toLowerCase()}.svg`,
      });
      this.addSubCategory(currentItem, index, false);
    });
  }
  setUpLanguageArrayForm(cultureUI: string, validators: boolean, name = '', slug = '', description = ''): void {
    const formGroup = this.fb.group({
      cultureUI: [cultureUI],
      subCategoryName: validators ? [name || '', Validators.required] : [name ?? ''],
      slug: [slug || ''],
      subCategoryDescription: [description || ''],
    });
    this.languagesForm.push(formGroup);
  }
  addSubCategory(cultureUI: string, index: number, validators: boolean): void {
    const formLanguageData = this.formData?.language[index] || null;
    if (this.catData.mode === 'EDIT') this.setUpLanguageArrayForm(cultureUI, validators, formLanguageData?.name, formLanguageData?.slug, formLanguageData?.description);
    else this.setUpLanguageArrayForm(cultureUI, validators);
  }
  onNoClick(): void {
    this.dialogRef.close();
  }
  wrapUpData(): ICategory {
    const formValue = this.subCategoryForm.value;
    const params = {
      _id: this.formData?._id || null,
      pageID: 0,
      name: formValue.title,
      featuredImg: '',
      parentId: this.selectedParentId,
      status: true,
      language: [],
    };
    formValue.languages.forEach((currentItem) => {
      if (currentItem.subCategoryName !== '' || currentItem.subCategoryDescription !== '' || currentItem.slug !== '') {
        params.language.push({
          cultureUI: currentItem.cultureUI,
          name: currentItem.subCategoryName,
          description: currentItem.subCategoryDescription,
          slug: currentItem.slug,
        });
      }
    });
    return params;
  }
  checkWhetherCategoryExists(params: ICategory): void {
    this.contentCategoryService
      .checkCategoryNameExist(params.name, params._id)
      .pipe(
        takeUntil(this.destroy$),
        tap((result: IHTTPResult) => {
          if (result.status === 200 && result.value === 'true') this.closeDialogAndSetUpSnackBar(StatusSnackbarType.ERROR, 'Failed! Category Already Exists');
          else if (result.status === 200 && result.value === 'false') this.updateCategoryInfo(params);
          else this.closeDialogAndSetUpSnackBar(StatusSnackbarType.ERROR, 'Error Occured! Please Try Again');
        }),
      )
      .subscribe();
  }
  addNewSubCategory(params: ICategory): void {
    this.contentCategoryService
      .addContentCategory(params)
      .pipe(
        takeUntil(this.destroy$),
        tap((result) => {
          if (result.status === 200) this.closeDialogAndSetUpSnackBar(StatusSnackbarType.SUCCESS, 'Successfully Added');
          else this.closeDialogAndSetUpSnackBar(StatusSnackbarType.ERROR, 'Error Occured! Please Try Again');
        }),
      )
      .subscribe();
  }
  saveSubCategories(): void {
    if (this.isSubCategoryAlreadyExist(this.subCategoryForm.value.title)) this.closeDialogAndSetUpSnackBar(StatusSnackbarType.ERROR, 'Failed! Category Already Exists');
    else {
      const params = this.wrapUpData();
      if (this.catData.mode === 'EDIT') {
        if (params.parentId === null) this.checkWhetherCategoryExists(params);
        else this.updateCategoryInfo(params);
      } else this.addNewSubCategory(params);
    }
  }
  trackByIndex(index: number): number {
    return index;
  }
  isSubCategoryAlreadyExist(name: string): boolean {
    let present = false;
    this.catData?.allSubCategories?.every((currentItem) => {
      if (currentItem.name === name && currentItem._id !== this.formData?._id) {
        present = true;
        return false;
      }
      return true;
    });
    return present;
  }
  updateCategoryInfo(params: ICategory) {
    this.contentCategoryService
      .updateCategoryNameByID(params)
      .pipe(
        takeUntil(this.destroy$),
        tap((result) => {
          if (result.status === 200) this.closeDialogAndSetUpSnackBar(StatusSnackbarType.SUCCESS, 'Successfully Updated');
          else this.closeDialogAndSetUpSnackBar(StatusSnackbarType.ERROR, 'Error Occured! Please Try Again');
        }),
      )
      .subscribe();
  }
  closeDialogAndSetUpSnackBar(type: StatusSnackbarType, message: string): void {
    this.dialogRef.close({
      type: type,
      message: message,
    } as StatusSnackbarModel);
  }
}
