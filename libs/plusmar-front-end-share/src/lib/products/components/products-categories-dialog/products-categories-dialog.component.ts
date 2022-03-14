import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { IHTTPResult } from '@reactor-room/model-lib';
import { CommonMethodsService } from '@reactor-room/plusmar-front-end-share/services/common-methods.service';
import { ProductsService } from '@reactor-room/plusmar-front-end-share/services/products.service';
import { ICatSubCatHolder, IProductCategory, IProductCategoryList } from '@reactor-room/itopplus-model-lib';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'reactor-room-products-categories-dialog',
  templateUrl: './products-categories-dialog.component.html',
  styleUrls: ['./products-categories-dialog.component.scss'],
})
export class ProductsCategoriesDialogComponent implements OnInit, OnDestroy {
  categoryData: IProductCategory;
  categoryForm: FormGroup;
  allCategories: FormArray;
  categoryFormMode = 'ADD';
  headLabel = this.translate.instant('Create New Categories');
  editCategoryData: IProductCategoryList;
  editCategoryChangeHolder = [] as ICatSubCatHolder[];
  crudCategorySubscription: Subscription;
  addProductCategorySubscription: Subscription;
  catLoaderText = this.translate.instant('Loading. Please wait') + '...';
  catManageLoader = false;
  catSubCatValueHolder = [] as string[];
  catSubCatUniqueError = this.translate.instant('Category Sub-Category unique');
  catRequireError = this.translate.instant('Category is required');
  toastPosition = 'toast-bottom-right';

  emptyCategoryData: IProductCategory = {
    categories: [
      {
        categoryID: null,
        category: '',
        subCategories: [
          {
            subCategoryID: null,
            subCategory: '',
          },
        ],
      },
    ],
  };

  get categoriesFormArray(): FormArray {
    return <FormArray>this.categoryForm.controls.categories;
  }

  constructor(
    public dialogRef: MatDialogRef<ProductsCategoriesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public catData,
    private fb: FormBuilder,
    private productService: ProductsService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    public translate: TranslateService,
    private commonService: CommonMethodsService,
  ) {
    if (catData?.category) {
      this.categoryFormMode = 'EDIT';
      this.editCategoryData = catData;
      this.headLabel = this.translate.instant('Edit Category');
    } else {
      this.catSubCatValueHolder = catData;
    }
  }

  ngOnInit(): void {
    if (window.innerWidth < 768) this.toastPosition = 'toast-top-right';
    this.initiateCategory();
    this.categoryForm = this.fb.group({
      categories: this.fb.array([]),
    });

    if (this.categoryFormMode === 'EDIT') {
      this.categoryData = {
        categories: [this.editCategoryData],
      };
      this.setCategory(this.categoryData);
    } else {
      this.setCategory(this.categoryData);
    }
    this.allCategories = <FormArray>this.categoryForm.controls.categories;
  }

  ngOnDestroy(): void {
    this.crudCategorySubscription?.unsubscribe();
    this.addProductCategorySubscription?.unsubscribe();
  }

  initiateCategory(): void {
    if (!this.categoryData) {
      this.categoryData = this.emptyCategoryData;
    }
  }

  setCategory(categoryData: IProductCategory): void {
    const control = <FormArray>this.categoryForm.controls.categories;
    categoryData.categories.forEach((cat) => {
      const catGroupObj = {
        category: new FormControl(cat.category, [Validators.required]),
        subCategories: this.setSubCategories(cat),
      };
      if (this.categoryFormMode === 'EDIT') catGroupObj['categoryID'] = cat.categoryID ? cat.categoryID : '';
      control.push(this.fb.group(catGroupObj));
    });
  }

  setSubCategories(category: IProductCategoryList): FormArray {
    const subCategoriesArray = new FormArray([]);
    category.subCategories.forEach((subCat) => {
      const subCatGroupObj = {
        subCategory: new FormControl(subCat.subCategory, [Validators.required]),
      };
      if (this.categoryFormMode === 'EDIT') {
        subCatGroupObj['subCategoryID'] = subCat.subCategoryID ? subCat.subCategoryID : '';
      }
      subCategoriesArray.push(this.fb.group(subCatGroupObj));
    });
    return subCategoriesArray;
  }

  addCategory(): void {
    this.setCategory(this.emptyCategoryData);
  }

  removeCategory(i: number): void {
    this.allCategories.removeAt(i);
  }

  addSubCategory(category): void {
    category.controls.subCategories.push(
      this.fb.group({
        subCategory: new FormControl('', [Validators.required]),
      }),
    );
  }

  removeSubCategory(category: FormGroup, i: number): void {
    const subCatArray = <FormArray>category.controls.subCategories;
    if (this.categoryFormMode === 'EDIT') {
      const subCategoryItem = subCatArray.at(i) as FormGroup;
      const subCategoryRemovedID = subCategoryItem.get('subCategoryID')?.value;
      const catID = category.controls['categoryID'].value;
      const subCatName = subCategoryItem.get('subCategory')?.value;
      if (subCategoryRemovedID) {
        this.addToEditCategoryHolder(catID, subCatName, subCategoryRemovedID, 'DELETE');
      }
    }
    subCatArray.removeAt(i);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  saveCategories(): void {
    if (this.categoryForm.valid) {
      this.categoryFormMode === 'ADD' ? this.saveNewCategory() : this.editCategory();
    }
  }
  saveNewCategory(): void {
    this.catLoaderText = this.translate.instant('Please wait Saving new categories');
    this.catManageLoader = true;
    const categoryData = this.categoryForm.value as IProductCategory;
    this.productService.addProductCategory(categoryData.categories).subscribe((result: IHTTPResult) => {
      if (result.status === 200) {
        const successTitle = this.translate.instant('Success');
        const successText = this.translate.instant(result.value);
        this.toastr.success(successText, successTitle, { positionClass: this.toastPosition });
        this.dialogRef.close([result, categoryData.categories]);
        this.catManageLoader = false;
      } else {
        this.catManageLoader = false;
        const errorTitle = this.translate.instant('Error');
        const { value } = result;
        const errorText = this.commonService.extractResponseMessage(value);
        this.showUniqueError(errorText);
        this.toastr.error(errorText, errorTitle, { positionClass: this.toastPosition });
      }
    });
  }

  showUniqueError(value: string): void {
    const isNameExists = value?.match(/'(.*?)'/);
    if (isNameExists?.length) {
      const nameExists = isNameExists[1];
      this.categoriesFormArray.controls.map((cat: FormGroup) => {
        const catControl = cat?.controls?.category as FormControl;
        const catValue = catControl.value;
        if (catValue === nameExists) catControl.setErrors({ catSubCatUnique: true });
        const subArray = cat?.controls?.subCategories as FormArray;
        let setSubCatError = false;
        subArray.controls.map((subCat: FormGroup) => {
          const subControl = subCat?.controls?.subCategory;
          if (subControl.value === nameExists && !setSubCatError) {
            subControl.setErrors({ catSubCatUnique: true });
            setSubCatError = true;
          }
        });
      });
    }
  }

  editCategory() {
    this.detectEditCategory();
    if (this.editCategoryChangeHolder.length) {
      this.catLoaderText = this.translate.instant('Please wait Updating categories');
      this.catManageLoader = true;
      this.crudCategorySubscription = this.productService.crudProductCategory(this.editCategoryChangeHolder).subscribe(
        (result) => {
          const updateProductText = this.translate.instant('Update Product');
          this.catManageLoader = false;
          this.showEditCategoryResponse(result, updateProductText);
        },
        (err) => {
          console.log('error updating category', err);
          this.catManageLoader = false;
        },
      );
    } else {
      this.catManageLoader = false;
      const noEditTitle = this.translate.instant('No Edit');
      const noEditText = this.translate.instant('Category not yet edited');
      this.toastr.warning(noEditText, noEditTitle, { positionClass: this.toastPosition });
    }
  }

  showEditCategoryResponse(response: IHTTPResult[], title: string) {
    let successFlag = true;
    const errorText = this.translate.instant('Error');
    if (response) {
      let displayHTML = '<div> <ul class="response-list">';
      response.forEach((data) => {
        const { status } = data;
        const value = this.commonService.extractResponseMessage(data.value);
        if (status === 200) {
          displayHTML += `<li class="success-item"> ${value}</li>`;
        } else {
          this.showUniqueError(value);
          displayHTML += `<li class="error-item"> ${value}</li>`;
          successFlag = false;
          this.editCategoryChangeHolder = [];
        }
      });

      this.openSuccessDialog({ text: displayHTML, title: successFlag ? title : errorText }, !successFlag);
      displayHTML += '</ul> <div>';
    }
  }

  openSuccessDialog(message: { text: string; title: string }, isError = false): void {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
      data: isError,
    });

    dialogRef.componentInstance.data = message;
    dialogRef.componentInstance.isError = isError;

    dialogRef.afterClosed().subscribe((result) => {
      if (!isError) this.onNoClick();
    });
  }

  detectEditCategory() {
    const editCatFormData: IProductCategoryList = this.categoryForm.value.categories[0];
    const editCatFormArray = this.categoryForm.controls['categories'] as FormArray;
    const editCatFormGroup = editCatFormArray.at(0) as FormGroup;
    const isCatNameChanged = editCatFormGroup.controls['category'].dirty;
    if (isCatNameChanged) this.addToEditCategoryHolder(editCatFormData.categoryID, editCatFormData.category, -1, 'UPDATE');

    const subCatFormArray = editCatFormGroup.controls['subCategories'] as FormArray;
    subCatFormArray.controls.map((subCatFormGroup: FormGroup) => {
      const isSubCatChanged = subCatFormGroup.dirty;
      if (isSubCatChanged) {
        const catID = editCatFormData.categoryID;
        const subCatID = subCatFormGroup?.controls['subCategoryID']?.value;
        const subCatName = subCatFormGroup.controls['subCategory'].value;
        this.addToEditCategoryHolder(catID, subCatName, subCatID ? subCatID : 0, subCatID ? 'UPDATE' : 'INSERT');
      }
    });
  }

  categoryControl(i: number): AbstractControl {
    const catFormGroup = this.allCategories['controls'][i] as FormGroup;
    return catFormGroup.controls.category;
  }

  addToEditCategoryHolder(id: number, name: string, subCatID: number, type: string) {
    const catObj: ICatSubCatHolder = {
      id,
      name,
      subCatID,
      type,
    };
    this.editCategoryChangeHolder.push(catObj);
  }
}
