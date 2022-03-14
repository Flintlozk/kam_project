import { TranslateService } from '@ngx-translate/core';
import { ENTER } from '@angular/cdk/keycodes';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { deepCopy } from '@reactor-room/itopplus-front-end-helpers';
import { CRUD_MODE, IHTTPResult } from '@reactor-room/model-lib';
import { CUSTOMER_TAG_COLOR, CUSTOMER_TAG_OBJECT_TYPE, ICustomerCrudOperation, ICustomerTagCRUD } from '@reactor-room/itopplus-model-lib';
import { differenceWith, isEmpty, isEqual } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { CustomerService } from '@reactor-room/plusmar-front-end-share/services/customer.service';
import { CustomerTagsDialogComponent } from '../customer-tags-dialog/customer-tags-dialog.component';

export const attachCRUDOperationTypeToTag = (tagData: ICustomerTagCRUD[], mode: CRUD_MODE, customerID: number): ICustomerTagCRUD[] => {
  return tagData?.map((tag) => ({
    ...tag,
    customerID: CRUD_MODE[mode] === CRUD_MODE.INSERT ? customerID : -1,
    type: CRUD_MODE[mode],
  }));
};
@Component({
  selector: 'reactor-room-customer-tag-add-edit-dialog',
  templateUrl: './customer-tag-add-edit-dialog.component.html',
  styleUrls: ['./customer-tag-add-edit-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CustomerTagAddEditDialogComponent implements OnInit {
  isTag = false;
  constructor(
    private customerService: CustomerService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<CustomerTagAddEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) private id: number,
    private toastr: ToastrService,
    private translate: TranslateService,
  ) {
    this.customerID = id;
  }
  tagLoaderText = this.translate.instant('Loading');
  tagLoader = false;
  customerID: number;
  tagAttach = [] as ICustomerTagCRUD[];
  tagUnattach = [] as ICustomerTagCRUD[];
  storedAttachTag = [] as ICustomerTagCRUD[];
  storedUnattachTag = [] as ICustomerTagCRUD[];
  tagColorEnums = CUSTOMER_TAG_COLOR;
  tagErrorMessage: string;
  readonly separatorKeysCodes: number[] = [ENTER];
  toastPosition = 'toast-bottom-right';
  errorTitle = this.translate.instant('Error');
  successTitle = this.translate.instant('Success');

  ngOnInit(): void {
    if (window.innerWidth < 768) this.toastPosition = 'toast-top-right';
    this.getCustomerTags();
  }

  getCustomerTags(): void {
    this.tagLoader = true;
    this.tagLoaderText = this.translate.instant('Fetching customer tags Please wait');
    this.customerService.getCustomerTagByPageByID(this.customerID).subscribe(
      (result) => {
        if (result.length > 0) {
          this.isTag = true;
          this.getTagAttachUnattach(result);
          this.storeTagsInitialState();
          this.tagLoader = false;
        } else {
          this.tagLoader = false;
          this.isTag = false;
        }
      },
      () => {
        this.tagLoader = false;
        this.isTag = false;
        const errMessage = this.translate.instant('Error getting tag Please try later');
        this.toastr.error(errMessage, this.errorTitle, { positionClass: this.toastPosition });
      },
    );
  }

  storeTagsInitialState(): void {
    this.storedAttachTag = deepCopy(this.tagAttach);
    this.storedUnattachTag = deepCopy(this.tagUnattach);
  }

  getTagAttachUnattach(tags: ICustomerTagCRUD[]): void {
    tags.forEach((tag) => (tag.tagMappingID === -1 ? this.tagUnattach.push(tag) : this.tagAttach.push(tag)));
  }

  addTag(addTag: ICustomerTagCRUD): void {
    this.tagAttach.push(addTag);
    this.tagUnattach = this.tagUnattach.filter((tag) => tag.id !== addTag.id);
  }

  removeTag(removedTag: ICustomerTagCRUD): void {
    if (!isEmpty(removedTag)) {
      this.tagUnattach.push(removedTag);
      this.tagAttach = this.tagAttach.filter((tag) => tag.id !== removedTag.id);
    }
  }

  onSaveClick(): void {
    this.initiateTagTransaction();
  }

  detectTagChanges(): ICustomerCrudOperation {
    const insertCustTag = differenceWith(this.tagAttach, this.storedAttachTag, isEqual) as ICustomerTagCRUD[];
    const deleteCustTag = this.tagUnattach.filter((tag) => tag.tagMappingID !== -1);
    return {
      insertCustTag,
      deleteCustTag,
    };
  }

  initiateTagTransaction(): void {
    const { insertCustTag, deleteCustTag } = this.detectTagChanges();
    const noDataTitle = this.translate.instant('No edit');
    const noDataMsg = this.translate.instant('No changes have been made yet');
    if (insertCustTag.length === 0 && deleteCustTag.length === 0) {
      this.toastr.warning(noDataMsg, noDataTitle, { positionClass: this.toastPosition });
    } else {
      this.processTagTransaction({ insertCustTag, deleteCustTag });
    }
  }

  processTagTransaction(tagsOperation: ICustomerCrudOperation): void {
    const { insertCustTag, deleteCustTag } = tagsOperation;
    const insertTags = attachCRUDOperationTypeToTag(insertCustTag, CRUD_MODE.INSERT, this.customerID);
    const deteleTags = attachCRUDOperationTypeToTag(deleteCustTag, CRUD_MODE.DELETE, this.customerID);
    const tagCRUD = [...insertTags, ...deteleTags] as ICustomerTagCRUD[];
    this.executeTagTransaction(tagCRUD);
  }

  executeTagTransaction(tagCRUD: ICustomerTagCRUD[]): void {
    this.tagLoader = true;
    this.tagLoaderText = this.translate.instant('Please wait associating tags');
    this.customerService.crudCustomerTagData(tagCRUD, CUSTOMER_TAG_OBJECT_TYPE.MAPPING).subscribe(
      (result) => {
        result.length > 0 ? this.processSaveResponse(result) : this.processErrorResponse();
        this.tagLoader = false;
      },
      () => {
        this.tagLoader = false;
      },
    );
  }
  processErrorResponse(): void {
    const errMessage = this.translate.instant('Error associating tags to customer');
    this.toastr.error(errMessage, this.errorTitle, { positionClass: this.toastPosition });
  }

  processSaveResponse(result: IHTTPResult[]): void {
    let isResultError = false;
    this.tagLoader = false;
    result.forEach((response) => {
      const value = this.translate.instant(response.value);
      if (response.status === 200) {
        this.toastr.success(value, this.successTitle, { positionClass: this.toastPosition });
      } else {
        isResultError = true;
        this.toastr.error(value, this.errorTitle, { positionClass: this.toastPosition });
      }
    });

    if (!isResultError) this.onNoClick(true);
  }

  onNoClick(status = false): void {
    this.dialogRef.close(status);
  }
  onAddClick(): void {
    const dialogRef = this.dialog.open(CustomerTagsDialogComponent, {
      width: '100%',
      data: null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.isTag = true;
        if (result?.data?.length > 0) this.tagUnattach = [...this.tagUnattach, ...result.data];
      }
    });
  }
}
