import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PaperSize, PaperType, PurchaseOrderShippingDetail } from '@reactor-room/itopplus-model-lib';
import * as _ from 'lodash';
@Component({
  selector: 'reactor-room-printing-select-type-dialog',
  templateUrl: './printing-select-type-dialog.component.html',
  styleUrls: ['./printing-select-type-dialog.component.scss'],
})
export class PrintingSelectTypeDialogComponent implements OnInit {
  EnumPaperSize = PaperSize;
  EnumPaperType = PaperType;
  sizeSelected: PaperSize = PaperSize.SIZE_A4;
  typeSelected: PaperType = PaperType.LABEL;

  selected = this.EnumPaperType.LABEL;
  isAllow: boolean;

  detail = {
    selected: '',
    size: '',
  };

  constructor(public dialogRef: MatDialogRef<PrintingSelectTypeDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { shippingDetail: PurchaseOrderShippingDetail }) {}

  ngOnInit(): void {
    this.selected = this.EnumPaperType.LABEL;
    this.typeSelected = this.EnumPaperType.LABEL;
    this.validateBeforeSelect();
  }
  onCancel(): void {
    this.dialogRef.close({ selected: null, size: null });
  }
  selectSizeReport(size: PaperSize): void {
    this.sizeSelected = size;
    this.validateBeforeSelect();
  }
  onSelect(): void {
    if (this.typeSelected && this.typeSelected && this.isAllow) {
      this.detail.selected = this.typeSelected;
      this.detail.size = this.sizeSelected;
      this.dialogRef.close(this.detail);
    }
  }
  changeReportType(value: HTMLInputElement): void {
    this.typeSelected = PaperType[value.value];
    this.validateBeforeSelect();
  }

  validateBeforeSelect(): void {
    if (this.data.shippingDetail.trackingType === 'MANUAL') {
      this.isAllow = true;
    } else {
      if (!_.isEmpty(this.data.shippingDetail.trackingNo)) {
        this.isAllow = true;
      } else {
        this.isAllow = false;
      }
    }
  }
}
