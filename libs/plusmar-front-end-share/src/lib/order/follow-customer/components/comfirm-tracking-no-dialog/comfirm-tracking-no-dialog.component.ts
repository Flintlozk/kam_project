import { AfterViewInit, Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogService } from '@reactor-room/plusmar-front-end-share/services/dialog.service';
import { getUTCDayjs } from '@reactor-room/itopplus-front-end-helpers';
import { EnumTrackingType, GenericButtonMode, GenericDialogMode, PaymentShippingDetail } from '@reactor-room/itopplus-model-lib';

@Component({
  selector: 'reactor-room-comfirm-tracking-no-dialog',
  templateUrl: './comfirm-tracking-no-dialog.component.html',
  styleUrls: ['./comfirm-tracking-no-dialog.component.scss'],
})
export class ComfirmTrackingNoDialogComponent implements OnInit, AfterViewInit {
  currentDate = getUTCDayjs().toDate();
  currentTime = `${String(getUTCDayjs().toDate().getHours()).padStart(2, '0')}:${String(getUTCDayjs().toDate().getMinutes()).padStart(2, '0')}`;
  trackingForm: FormGroup;
  isReadOnly = false;
  isTrackingActive: boolean;
  flatRate: boolean;

  @ViewChild('trackingNo') trackingNoElem: ElementRef;
  constructor(
    private dialogService: DialogService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ComfirmTrackingNoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PaymentShippingDetail,
  ) {}
  createTrackingForm(): FormGroup {
    return this.formBuilder.group({
      shippingDate: [this.currentDate, Validators.required],
      shippingTime: [this.currentTime, Validators.required],
      trackingUrl: [''],
      trackingNo: ['', Validators.required],
      logistic: [{ value: '', disabled: true }, Validators.required],
    });
  }

  ngOnInit(): void {
    // this.isTrackingActive = true;
    this.trackingForm = this.createTrackingForm();
    this.flatRate = this.data.flatRate;
    if (this.flatRate) {
      this.isTrackingActive = true;
      if (this.data.shippingDetail) {
        this.trackingForm.controls['logistic'].setValue(this.data.shippingDetail.name);
        this.trackingForm.controls['trackingUrl'].setValue(this.data.shippingDetail.trackingUrl);
        this.trackingForm.controls['trackingNo'].setValue(this.data.shippingDetail.trackingNo);
      }
    } else {
      console.log('this.data.shippingDetail.trackingNo [LOG]:--> ', this.data.shippingDetail);
      this.isReadOnly = this.data.shippingDetail.isAutoGeneratyeTrackingNo && this.data.shippingDetail.trackingNo !== '';
      if (this.data.shippingDetail) {
        this.trackingForm.controls['logistic'].setValue(this.data.shippingDetail.name);
        this.trackingForm.controls['trackingUrl'].setValue(this.data.shippingDetail.trackingUrl);
        this.trackingForm.controls['trackingNo'].setValue(this.data.shippingDetail.trackingNo);
        const { trackingType } = this.data.shippingDetail;
        if (trackingType === EnumTrackingType.MANUAL) {
          this.isTrackingActive = true;
        } else {
          this.isTrackingActive = this.data.shippingDetail.isActive;
        }
      }
    }

    this.setFocusOnMessageBox();
  }

  ngAfterViewInit(): void {
    this.setFocusOnMessageBox();
  }

  setFocusOnMessageBox(): void {
    this.trackingNoElem?.nativeElement?.focus();
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    if (this.trackingForm.valid) {
      this.dialogRef.close(this.trackingForm.value);
    } else {
      this.dialogService.openDialog('Please fill in tracking No', GenericDialogMode.CAUTION, GenericButtonMode.CLOSE).subscribe(() => {
        // do nothing
      });
      // alert('Please Validate Field');
    }
  }

  onClickSwitchToManualInput(): void {
    this.isTrackingActive = true;
  }
  onRetry(): void {
    this.dialogRef.close('RETRY');
  }
}
