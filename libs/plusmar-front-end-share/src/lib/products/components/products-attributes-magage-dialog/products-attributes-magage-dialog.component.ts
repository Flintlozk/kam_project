import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { deepCopy, isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { CRUD_MODE, IHTTPResult } from '@reactor-room/model-lib';
import { CommonMethodsService } from '@reactor-room/plusmar-front-end-share/services/common-methods.service';
import { ProductsService } from '@reactor-room/plusmar-front-end-share/services/products.service';
import { ICatSubCatHolder, IProductAttributeList, IProductSubAttributeArray } from '@reactor-room/itopplus-model-lib';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'reactor-room-products-attributes-magage-dialog',
  templateUrl: './products-attributes-magage-dialog.component.html',
  styleUrls: ['./products-attributes-magage-dialog.component.scss'],
})
export class ProductsAttributesMagageDialogComponent implements OnInit {
  attributeManageFormGroup: FormGroup;
  addMode = CRUD_MODE.ADD;
  editMode = CRUD_MODE.EDIT;
  deleteMode = CRUD_MODE.DELETE;
  attrFormMode = CRUD_MODE.ADD;
  editAttributeData: IProductAttributeList;
  headLabel = this.translate.instant('Create New Attribute');
  editAttributeChangeHolder = [] as ICatSubCatHolder[];
  curdAttributeSubscription: Subscription;
  attributeLoaderText = this.translate.instant('Loading');
  attributeManageLoader = false;
  successTitle = this.translate.instant('Success');
  errorTitle = this.translate.instant('Error');
  attrRequireMsg = this.translate.instant('Attribute is required');
  attrUniqueMsg = this.translate.instant('Attribute is not unique');
  subAttrRequireMsg = this.translate.instant('Sub-Attribute is required');
  subAttrUniqueMsg = this.translate.instant('Sub-Attribute is not unique');
  toastPosition = 'toast-bottom-right';

  get attributeListFormArray(): FormArray {
    return this.attributeManageFormGroup.get('attributeList') as FormArray;
  }

  constructor(
    private productService: ProductsService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<ProductsAttributesMagageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public editAttrData: IProductAttributeList,
    private fb: FormBuilder,
    private dialog: MatDialog,
    public translate: TranslateService,
    private commonService: CommonMethodsService,
  ) {
    if (editAttrData?.attributeName) {
      this.attrFormMode = CRUD_MODE.EDIT;
      this.editAttributeData = editAttrData;
      this.headLabel = this.translate.instant('Edit Attribute');
    }
  }

  ngOnInit(): void {
    if (window.innerWidth < 768) this.toastPosition = 'toast-top-right';
    this.attributeManageFormGroup = this.getAttributeManageFormGroup();
  }

  onNoClick(status = false): void {
    if (!status) this.dialogRef.close();
  }

  getSubAttributeFormControl(attributeItem: FormGroup): FormArray {
    const subAttributeFromArray = attributeItem.get('subAttributes') as FormArray;
    return subAttributeFromArray;
  }

  addNewSubAttribute(attributeItem: FormGroup): void {
    const subAttributeFromArray = attributeItem.get('subAttributes') as FormArray;
    subAttributeFromArray.push(this.getSubAttributeFormGroup());
  }

  removeSubAttribute(attributeItem: FormGroup, index: number): void {
    const subAttributeFromArray = attributeItem.get('subAttributes') as FormArray;
    if (this.attrFormMode === this.editMode) {
      const subAttributeItem = subAttributeFromArray.at(index) as FormGroup;
      const subAttributeRemovedID = subAttributeItem.get('subAttributeID')?.value;
      const attrID = this.attributeManageFormGroup.value.attributeList[0].attributeID;
      const subAttrName = subAttributeItem.get('subAttributeName')?.value;
      if (subAttributeRemovedID) {
        this.addToEditAttributeHolder(attrID, subAttrName, subAttributeRemovedID, this.deleteMode);
      }
    }
    subAttributeFromArray.removeAt(index);
  }

  expandSubAttribute(index: number): void {
    const expandStatus = this.attributeListFormArray.controls[index].value.expandStatus;
    this.attributeListFormArray.controls[index].get('expandStatus').patchValue(!expandStatus);
  }
  addNewAttribute(): void {
    this.attributeListFormArray.push(this.getAttributeFormGroup());
  }
  removeAttribute(index: number): void {
    this.attributeListFormArray.removeAt(index);
  }

  getAttributeManageFormGroup(mode = this.attrFormMode): FormGroup {
    const attributeManageFormGroup = this.fb.group({
      attributeList: this.getAttributeFormArray(),
    });
    return attributeManageFormGroup;
  }

  getAttributeFormArray(mode = this.attrFormMode): FormArray {
    const attributeFormArray = this.fb.array(mode === this.addMode ? [this.getAttributeFormGroup()] : [this.patchAttributeFormGroup()]);
    return attributeFormArray;
  }

  getAttributeFormGroup(): FormGroup {
    const attributeFormGroup = this.fb.group({
      attributeID: [-1],
      attributeName: ['', Validators.required],
      expandStatus: [true],
      subAttributes: this.getSubAttributeFormArray(),
    });
    return attributeFormGroup;
  }

  getSubAttributeFormArray(): FormArray {
    const subAttributeFormArray = this.fb.array([this.getSubAttributeFormGroup()]);
    return subAttributeFormArray;
  }

  getSubAttributeFormGroup(): FormGroup {
    const subAttributeFormGroup = this.fb.group({
      subAttributeID: [-1],
      subAttributeName: ['', Validators.required],
    });
    return subAttributeFormGroup;
  }

  processFormSaveUpdate(): void {
    if (this.attributeManageFormGroup.valid) {
      this.attrFormMode === this.addMode ? this.saveAttributes() : this.editAttribute();
    }
  }

  editAttribute(): void {
    const noEditTitle = this.translate.instant('No Edit');
    const noEditText = this.translate.instant('Attributes not yet edited');
    try {
      this.attributeLoaderText = this.translate.instant('Please wait Updating Attributes');
      this.attributeManageLoader = true;
      this.detectEditAttribute();
      if (this.editAttributeChangeHolder.length) {
        this.curdAttributeSubscription = this.productService.crudProductAttribute(this.editAttributeChangeHolder).subscribe((result) => {
          this.showEditAttributeResponse(result, this.translate.instant('Update Attributes'));
          this.attributeManageLoader = false;
        });
      } else {
        this.attributeManageLoader = false;
        this.toastr.warning(noEditText, noEditTitle, { positionClass: this.toastPosition });
      }
    } catch (error) {
      this.toastr.warning(noEditText, noEditTitle, { positionClass: this.toastPosition });
      this.attributeManageLoader = false;
    }
  }

  showEditAttributeResponse(response: IHTTPResult[], title: string): void {
    let successFlag = true;
    if (response) {
      let displayHTML = '<div> <ul class="response-list">';
      response.forEach((data) => {
        const { status, value } = data;
        const errorText = this.commonService.getTranslatedResponse(value);
        if (errorText) {
          if (status === 200) {
            displayHTML += `<li class="success-item"> ${errorText}</li>`;
          } else {
            displayHTML += `<li class="error-item"> ${errorText}</li>`;
            successFlag = false;
            this.editAttributeChangeHolder = [];
          }
        }
      });
      this.openSuccessDialog({ text: displayHTML, title: successFlag ? title : this.translate.instant('Error') }, !successFlag);
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
      this.onNoClick(isError);
    });
  }

  detectEditAttribute(): void {
    const editAttrFormData: IProductAttributeList = this.attributeManageFormGroup.value.attributeList[0];
    const editAttrFormArray = this.attributeManageFormGroup.controls['attributeList'] as FormArray;
    const editAttrFormGroup = editAttrFormArray.at(0) as FormGroup;
    const isAttrNameChanged = editAttrFormGroup.controls['attributeName'].dirty;
    if (isAttrNameChanged) this.addToEditAttributeHolder(editAttrFormData.attributeID, editAttrFormData.attributeName, -1, CRUD_MODE.UPDATE);

    const subAttribFormArray = editAttrFormGroup.controls['subAttributes'] as FormArray;
    subAttribFormArray.controls.map((subAttrFormGroup: FormGroup) => {
      const isSubAttrChanged = subAttrFormGroup.dirty;
      if (isSubAttrChanged) {
        const attrID = editAttrFormData.attributeID;
        const subAttrID = subAttrFormGroup?.controls['subAttributeID']?.value;
        const subAttrName = subAttrFormGroup.controls['subAttributeName'].value;
        this.addToEditAttributeHolder(attrID, subAttrName, subAttrID ? subAttrID : 0, subAttrID !== -1 ? CRUD_MODE.UPDATE : CRUD_MODE.INSERT);
      }
    });
  }

  addToEditAttributeHolder(id: number, name: string, subCatID: number, type: string) {
    const catObj: ICatSubCatHolder = {
      id,
      name,
      subCatID,
      type,
    };
    this.editAttributeChangeHolder.push(catObj);
  }

  saveAttributes(): void {
    try {
      this.attributeLoaderText = this.translate.instant('Please wait Saving Attributes');
      this.attributeManageLoader = true;
      const productAttributesValue = deepCopy(this.attributeListFormArray.value);
      const attributeData: IProductAttributeList[] = productAttributesValue.map((item) => {
        delete item['expandStatus'];
        return item;
      });

      this.productService.addProductAttributeManage(attributeData).subscribe((result) => {
        if (result.status === 200) {
          const successText = this.translate.instant(result.value);
          this.toastr.success(successText, this.successTitle, { positionClass: this.toastPosition });
          this.attributeManageLoader = false;
          this.dialogRef.close(result);
        } else {
          this.attributeManageLoader = false;
          const { value } = result;
          const errorText = this.commonService.extractResponseMessage(value);
          this.showUniqueError(result.value);
          this.toastr.error(errorText, this.errorTitle, { positionClass: this.toastPosition });
        }
      });
    } catch (error) {
      this.attributeManageLoader = false;
    }
  }

  categoryControl(i: number): AbstractControl {
    const catFormGroup = this.attributeListFormArray['controls'][i] as FormGroup;
    return catFormGroup.controls.category;
  }

  showUniqueError(value: string) {
    const isNameExists = value?.match(/'(.*?)'/);
    const nameExists = isNameExists[1];
    if (nameExists.length) {
      let setAttrError = false;
      this.attributeListFormArray.controls.map((attr: FormGroup) => {
        const attrControl = attr?.controls?.attributeName as FormControl;
        const attrValue = attrControl.value;
        if (attrValue === nameExists && !setAttrError) {
          attrControl.setErrors({ attrSubAttrUnique: true });
          setAttrError = true;
        }
        const subArray = attr?.controls?.subAttributes as FormArray;
        let setSubAttrError = false;
        subArray.controls.map((subAttr: FormGroup) => {
          const subControl = subAttr?.controls?.subAttributeName;
          if (subControl.value === nameExists && !setSubAttrError) {
            subControl.setErrors({ attrSubAttrUnique: true });
            setSubAttrError = true;
          }
        });
      });
    }
  }

  patchAttributeFormGroup(): FormGroup {
    return this.fb.group({
      attributeID: [this.editAttributeData.attributeID],
      attributeName: [this.editAttributeData.attributeName, Validators.required],
      expandStatus: [true],
      subAttributes: this.patchSubAttributeFormArray(this.editAttributeData.subAttributes),
    });
  }

  patchSubAttributeFormArray(subAttrib: IProductSubAttributeArray[]): FormArray {
    const subAttributeFormArray = this.fb.array([]);
    subAttrib.forEach((subAttr) => {
      const subAttributeFormGroup = this.fb.group({
        subAttributeID: [subAttr.subAttributeID],
        subAttributeName: [subAttr.subAttributeName, Validators.required],
      });
      subAttributeFormArray.push(subAttributeFormGroup);
    });
    return subAttributeFormArray;
  }
}
