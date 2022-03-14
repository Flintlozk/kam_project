import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ICustomerCloseReason } from '@reactor-room/itopplus-model-lib';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CustomerClosedReasonService } from '../../services/customer-closed-reason.service';
@Component({
  selector: 'reactor-room-customer-closed-reason',
  templateUrl: './customer-closed-reason.component.html',
  styleUrls: ['./customer-closed-reason.component.scss'],
})
export class CustomerClosedReasonComponent implements OnInit {
  formReasonList: FormGroup;
  reasonList: ICustomerCloseReason[];
  destroy$: Subject<void> = new Subject<void>();

  constructor(
    private dialogRef: MatDialogRef<CustomerClosedReasonComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { audienceID: number },
    private formBuilder: FormBuilder,
    private customerClosedReasonService: CustomerClosedReasonService,
  ) {}

  ngOnInit(): void {
    this.initFormGroup();
    this.getCustomerClosedReasons();
  }

  initFormGroup(): void {
    this.formReasonList = this.formBuilder.group({
      reasonID: [{ value: -1 }, [Validators.required, Validators.min(0)]],
      description: '',
    });

    this.formReasonList.controls['reasonID'].patchValue(-1);
  }
  onSave(): void {
    if (this.formReasonList.valid && this.formReasonList.value.reasonID !== -1) {
      this.customerClosedReasonService.addReasonToAudience(this.data.audienceID, this.formReasonList.value).subscribe(
        () => {
          this.dialogRef.close(true);
        },
        () => {
          /* whatever err is still close audience  */
          this.dialogRef.close(true);
        },
      );
    }
  }
  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSelectReason(ID: number): void {
    this.formReasonList.controls['reasonID'].patchValue(ID);
  }

  getCustomerClosedReasons(): void {
    this.customerClosedReasonService
      .getCustomerClosedReasons()
      .pipe(takeUntil(this.destroy$))
      .subscribe((reasons) => {
        this.reasonList = reasons;
      });
  }
}
