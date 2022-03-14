import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { ColorCodeEmitter, CRUD_MODE, IHTTPResult, IKeyValuePair } from '@reactor-room/model-lib';
import { CommonMethodsService } from '@reactor-room/plusmar-front-end-share/services/common-methods.service';
import { CustomerService } from '@reactor-room/plusmar-front-end-share/services/customer.service';
import { CUSTOMER_TAG_COLOR, CUSTOMER_TAG_OBJECT_TYPE, ICustomerTagCRUD } from '@reactor-room/itopplus-model-lib';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'reactor-room-customer-tags-dialog',
  templateUrl: './customer-tags-dialog.component.html',
  styleUrls: ['./customer-tags-dialog.component.scss'],
})
export class CustomerTagsDialogComponent implements OnInit {
  CRUD_MODE = CRUD_MODE;
  tagManageLoader = false;
  tagLoaderText = this.translate.instant('Loading');
  tagManageFormGroup: FormGroup;
  tagListFormArray: FormArray;
  headLabel = this.translate.instant('Create New Tags');
  tagFormMode = CRUD_MODE.ADD;
  addMode = CRUD_MODE.ADD;
  defaultColor = { key: 'CODE_FF7821', value: CUSTOMER_TAG_COLOR.CODE_FF7821 };
  tagInputColorCodes = [] as { colorCode: IKeyValuePair; displayFlag: boolean }[];
  addedTags: ICustomerTagCRUD[];
  toastPosition = 'toast-bottom-right';

  constructor(
    private dialog: MatDialog,
    private customerService: CustomerService,
    private dialogRef: MatDialogRef<CustomerTagsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public editTagData: ICustomerTagCRUD,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private translate: TranslateService,
    private commonService: CommonMethodsService,
  ) {
    if (editTagData?.id) {
      this.tagFormMode = CRUD_MODE.EDIT;
      this.headLabel = this.translate.instant('Edit Tag');
      const value = CUSTOMER_TAG_COLOR[editTagData.color];
      this.defaultColor = { key: editTagData.color, value };
      this.setDefaultColor();
    }
  }

  ngOnInit(): void {
    if (window.innerWidth < 768) this.toastPosition = 'toast-top-right';
    this.tagManageFormGroup = this.getTagManageFormGroup();
    this.tagListFormArray = this.tagManageFormGroup.get('tagList') as FormArray;
    this.setDefaultColor();
  }

  setDefaultColor(): void {
    this.tagInputColorCodes[0] = { colorCode: this.defaultColor, displayFlag: false };
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

  onColorCodeSeleted(event: ColorCodeEmitter): void {
    const { colorCode, currentIndex } = event;
    this.tagInputColorCodes[currentIndex] = { colorCode, displayFlag: true };
  }

  onColorDropDown(currentIndex: number): void {
    this.tagInputColorCodes[currentIndex].displayFlag = !this.tagInputColorCodes[currentIndex].displayFlag;
  }

  outsideClickHandler(event: boolean, currentIndex: number): void {
    if (event) {
      this.tagInputColorCodes[currentIndex].displayFlag = false;
    }
  }

  onSaveClick(): void {
    if (this.tagManageFormGroup.valid) {
      this.tagFormMode === CRUD_MODE.ADD ? this.saveNewTags() : this.editTag();
    }
  }

  saveNewTags(): void {
    this.tagManageLoader = true;
    this.tagLoaderText = this.translate.instant('Please wait Adding tags');
    const addTags: ICustomerTagCRUD[] = this.tagListFormArray?.controls.map((ctrl, i) => ({ id: -1, name: ctrl.value, color: this.getColorCode(i), type: CRUD_MODE.INSERT }));
    if (!addTags.length) throw new Error(this.translate.instant('Not valid customer tags Error in saving'));
    this.customerService.crudCustomerTagData(addTags, CUSTOMER_TAG_OBJECT_TYPE.TAG).subscribe(
      (result) => {
        result.length > 0 ? this.processSaveResponse(result, addTags.length) : this.processErrorResponse(CRUD_MODE.INSERT);
      },
      (err) => {
        this.processErrorResponse(CRUD_MODE.INSERT);
      },
    );
  }

  processSaveResponse(result: IHTTPResult[], currentTagCount: number): void {
    let isResultError = false;
    this.tagManageLoader = false;
    result.forEach((response) => {
      if (response.status === 200) {
        const saveResponse: { message: string; data: ICustomerTagCRUD[] } = JSON.parse(response.value);
        this.addedTags = saveResponse.data;
        const succMessage = this.translate.instant(saveResponse?.message);
        this.toastr.success(succMessage, this.translate.instant('Success'), { positionClass: this.toastPosition });
      } else {
        isResultError = true;
        if (response.value === 'tag_max_limit_message') {
          const errMessage = this.translate.instant(response?.value, { totalTag: 40, currentTagCount });
          this.toastr.error(errMessage, this.translate.instant('Error'), { positionClass: this.toastPosition });
        } else {
          const errMessage = this.commonService.getTranslatedResponse(response.value);
          this.toastr.error(errMessage, this.translate.instant('Error'), { positionClass: this.toastPosition });
        }
      }
    });

    if (!isResultError) this.onNoClick(true);
  }

  processAddEditSuccessResponse(result: IHTTPResult[]): void {
    this.tagManageLoader = false;
    const successTitle = this.translate.instant('Success');
    this.showTagResponse(result, successTitle);
  }

  processErrorResponse(type: string): void {
    this.tagManageLoader = false;
    const value = type === CRUD_MODE.INSERT ? 'insert_tag_error' : 'update_tag_error';
    const errMessage: IHTTPResult = {
      status: 403,
      value,
    };
    const errTitle = this.translate.instant('Success');
    this.showTagResponse([errMessage], errTitle);
  }

  getColorCode(i: number): string {
    return this.tagInputColorCodes[i]?.colorCode.key as string;
  }

  editTag(): void {
    const isEditFormChanged = this.detectEditFormChanged();
    if (!isEditFormChanged) {
      const errTitle = this.translate.instant('No Edit');
      const errMessage = this.translate.instant('Customer Tag not changed yet');
      this.toastr.warning(errMessage, errTitle, { positionClass: this.toastPosition });
    } else {
      this.processEditTag();
    }
  }

  processEditTag(): void {
    this.tagLoaderText = this.translate.instant('Please wait Updating tags');
    const color = this.tagInputColorCodes[0].colorCode.key as string;
    const id = this.editTagData?.id;
    const name = this.tagListFormArray.at(0).value as string;
    const type = CRUD_MODE.UPDATE;
    const editData = { id, name, color, type };
    const processType = this.translate.instant('updating');
    this.customerService.crudCustomerTagData([editData], CUSTOMER_TAG_OBJECT_TYPE.TAG).subscribe(
      (result) => {
        if (result.length > 0) {
          this.processEditResponse(result);
        } else {
          this.processErrorResponse(processType);
        }
      },
      () => {
        this.processErrorResponse(processType);
      },
    );
  }

  processEditResponse(result: IHTTPResult[]): void {
    result.forEach((response) => {
      if (response.status === 200) {
        const succMessage = this.translate.instant(response.value);
        this.toastr.success(succMessage, this.translate.instant('Success'), { positionClass: this.toastPosition });
        this.onNoClick(true);
      } else {
        const errMessage = this.commonService.getTranslatedResponse(response.value);
        this.toastr.error(errMessage, this.translate.instant('Error'), { positionClass: this.toastPosition });
      }
    });
  }

  detectEditFormChanged(): boolean {
    const currentColor = this.tagInputColorCodes[0].colorCode.value;
    const defaultColor = this.defaultColor.value;
    const isColorChanged = currentColor === defaultColor ? false : true;
    return isColorChanged || this.tagManageFormGroup.dirty ? true : false;
  }

  addNewTag(isValid: boolean, tagItemIndex: number): void {
    if (this.tagFormMode === CRUD_MODE.ADD) {
      const lastIndexValid = this.tagListFormArray.at(this.tagListFormArray.length - 1);

      if (isValid && lastIndexValid.valid) {
        this.tagListFormArray.push(this.fb.control('', Validators.required));
        this.tagInputColorCodes.push({ colorCode: this.defaultColor, displayFlag: false });

        setTimeout(() => {
          const id = 'customer-new-tag-input-' + (Number(tagItemIndex) + 1);
          const element = document.getElementById(id); // ? Focus next input on adding new
          if (element) {
            element.focus();
          }
        }, 1);
      }
    } else if (this.tagFormMode === CRUD_MODE.EDIT) {
      this.editTag();
    }
  }

  onNoClick(status = false): void {
    let data = [];
    if (status === true) data = this.addedTags;
    this.dialogRef.close({ status, data });
  }

  removeTag(index: number): void {
    this.tagListFormArray.removeAt(index);
    this.tagInputColorCodes.splice(index, 1);
  }

  showTagResponse(response: IHTTPResult[], title: string): void {
    let successFlag = true;
    if (response) {
      let displayHTML = '<div> <ul class="response-list">';
      response.forEach((data) => {
        const { status } = data;
        const value = this.translate.instant(data.value);
        if (status === 200) {
          displayHTML += `<li class="success-item"> ${value}</li>`;
        } else {
          //this.showUniqueError(value);
          displayHTML += `<li class="error-item"> ${value}</li>`;
          successFlag = false;
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

    dialogRef.afterClosed().subscribe(() => {
      if (!isError) this.onNoClick(true);
    });

    this.translate.instant('tag_update_success');
  }
}
