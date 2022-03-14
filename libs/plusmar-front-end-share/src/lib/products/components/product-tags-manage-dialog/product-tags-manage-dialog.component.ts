import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CRUD_MODE, IHTTPResult } from '@reactor-room/model-lib';
import { ProductsService } from '@reactor-room/plusmar-front-end-share/services/products.service';
import { IProductTag, PRODUCT_TRANSLATE_MSG } from '@reactor-room/itopplus-model-lib';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'reactor-room-product-tags-manage-dialog',
  templateUrl: './product-tags-manage-dialog.component.html',
  styleUrls: ['./product-tags-manage-dialog.component.scss'],
})
export class ProductTagsManageDialogComponent implements OnInit {
  tagManageFormGroup: FormGroup;
  tagListFormArray: FormArray;
  headLabel = this.translate.instant('Create New Tag');
  tagFormMode = CRUD_MODE.ADD;
  tagManageLoader = false;
  addMode = CRUD_MODE.ADD;
  tagLoaderText = this.translate.instant('Loading');
  errTitle = this.translate.instant('Error');
  toastPosition = 'toast-bottom-right';

  constructor(
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<ProductTagsManageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private editTagData: IProductTag,
    private fb: FormBuilder,
    private productService: ProductsService,
    public translate: TranslateService,
  ) {
    if (editTagData?.id) {
      this.tagFormMode = CRUD_MODE.EDIT;
      this.headLabel = this.translate.instant('Edit Tag');
    }
  }

  ngOnInit(): void {
    if (window.innerWidth < 768) this.toastPosition = 'toast-top-right';
    this.tagManageFormGroup = this.getTagManageFormGroup();
    this.tagListFormArray = this.tagManageFormGroup.get('tagList') as FormArray;
  }

  addNewTag(isValid: boolean, tagItemIndex: number): void {
    // this.tagListFormArray.push(this.fb.control('', Validators.required));
    const lastIndexValid = this.tagListFormArray.at(this.tagListFormArray.length - 1);

    if (isValid && lastIndexValid.valid) {
      this.tagListFormArray.push(this.fb.control('', Validators.required));

      setTimeout(() => {
        const id = 'product-new-tag-input-' + (Number(tagItemIndex) + 1);
        const element = document.getElementById(id); // ? Focus next input on adding new
        if (element) {
          element.focus();
        }
      }, 1);
    }
  }
  removeTag(index: number): void {
    this.tagListFormArray.removeAt(index);
  }

  getTagManageFormGroup(): FormGroup {
    const tagManageFormGroup = this.fb.group({
      tagList: this.getTagFormArray(),
    });
    return tagManageFormGroup;
  }

  getTagFormArray(): FormArray {
    const tagFormArray = this.fb.array([this.fb.control(this.tagFormMode === CRUD_MODE.EDIT ? this.editTagData?.name : '', Validators.required)]);
    return tagFormArray;
  }

  editTag(): void {
    this.tagManageLoader = true;
    this.tagLoaderText = this.translate.instant('Please wait... Updating tags');
    const id = this.editTagData?.id;
    const tagFormArrayControl = this.tagListFormArray.at(0) as AbstractControl;
    const name = tagFormArrayControl.value;
    this.productService.editProductTag(id, name).subscribe(
      (result: IHTTPResult) => {
        this.showToast(result);
        this.dialogRef.close(true);
        this.tagManageLoader = false;
      },
      () => {
        this.tagManageLoader = false;
        const errText = this.translate.instant(PRODUCT_TRANSLATE_MSG.pro_tag_update_error);
        this.toastr.error(errText, this.errTitle, { positionClass: this.toastPosition });
      },
    );
  }

  saveNewTags(): void {
    this.tagManageLoader = true;
    this.tagLoaderText = this.translate.instant('Please wait Adding tags');
    const tags: string[] = this.tagListFormArray.controls.map((ctrl) => ctrl.value);
    this.productService.addProductMultipleTag(tags).subscribe(
      (result: IHTTPResult) => {
        this.showToast(result);
        this.dialogRef.close(true);
        this.tagManageLoader = false;
      },
      (err) => {
        this.tagManageLoader = false;
        const errTitle = this.translate.instant(PRODUCT_TRANSLATE_MSG.pro_tag_save_error);
        this.toastr.error(errTitle, this.errTitle);
      },
    );
  }

  showToast(result: IHTTPResult): void {
    const { value } = result;
    const response = this.translate.instant(value);
    const succTitle = this.translate.instant('Success');
    result.status === 200
      ? this.toastr.success(response, succTitle, { positionClass: this.toastPosition })
      : this.toastr.error(response, this.errTitle, { positionClass: this.toastPosition });
  }

  onSaveClick(): void {
    if (this.tagManageFormGroup.valid) {
      this.tagFormMode === CRUD_MODE.ADD ? this.saveNewTags() : this.editTag();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
