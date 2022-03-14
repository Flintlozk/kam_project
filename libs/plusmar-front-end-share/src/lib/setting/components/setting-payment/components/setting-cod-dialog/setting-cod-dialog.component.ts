import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CashOnDeliveryDetail, EnumAuthError, EnumAuthScope, ThemeWithCodDetail } from '@reactor-room/itopplus-model-lib';
import { PaymentsService } from '@reactor-room/plusmar-front-end-share/services/settings/payments.service';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { inputOnlyNumber, isMobile } from '@reactor-room/itopplus-front-end-helpers';
// import { ThemeListComponent } from 'libs/cms-cdk/src/lib/theme/theme-list/theme-list.component';

@Component({
  selector: 'reactor-room-setting-cod-dialog',
  templateUrl: './setting-cod-dialog.component.html',
  styleUrls: ['./setting-cod-dialog.component.scss'],
})
export class SettingCodDialogComponent implements OnInit {
  CODForm: FormGroup;
  isInCreateMode = false as boolean;
  successDialog;
  destroy$: Subject<boolean> = new Subject<boolean>();
  isLoading = false as boolean;
  theme = 'SOCIAL';
  themeType = EnumAuthScope;
  constructor(
    public dialogRef: MatDialogRef<SettingCodDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ThemeWithCodDetail,
    private leadFormBuilder: FormBuilder,
    private paymentsService: PaymentsService,
    private dialog: MatDialog,
    public translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.theme = this.data.theme;
    if (this.data.cod) {
      this.isInCreateMode = this.data.cod.createMode;
      this.CODForm = this.leadFormBuilder.group({
        feePercent: [this.data.cod.feePercent, Validators.required],
        feeValue: [this.data.cod.feeValue, Validators.required],
        minimumValue: [this.data.cod.minimumValue, Validators.required],
      });
    } else {
      this.CODForm = this.leadFormBuilder.group({
        feePercent: [(0.0).toFixed(2), Validators.required],
        feeValue: [(0.0).toFixed(2), Validators.required],
        minimumValue: [(0.0).toFixed(2), Validators.required],
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onSubmit(): void {
    this.isLoading = true;
    const codInput = this.CODForm.value;
    this.paymentsService
      .updateCOD(codInput)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
          this.dialogRef.close(this.CODForm.value);
        }),
      )
      .subscribe(
        () => {
          this.openSuccessDialog({ text: this.translate.instant('Data have been updated successfully'), title: this.translate.instant('Updated Successfully') }, false);
        },
        (err) => {
          if (err.message.indexOf(EnumAuthError.PERMISSION_DENIED) !== -1) {
            this.openSuccessDialog(
              { text: this.translate.instant('Only owner and admin have permission to manage this part'), title: this.translate.instant('Permission denied') },
              true,
            );
          } else if (err.message.indexOf('"feePercent" is not allowed to be empty') !== -1 || err.message.indexOf('"minimumValue" is not allowed to be empty') !== -1) {
            this.openSuccessDialog({ text: this.translate.instant('Missing Cod Info'), title: this.translate.instant('Error') }, true);
          } else {
            this.openSuccessDialog(
              {
                text: this.translate.instant('Cant Update COD'),
                title: this.translate.instant('Error'),
              },
              true,
            );
          }
        },
      );
  }

  openSuccessDialog(data, isError = false): void {
    this.successDialog = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    this.successDialog.componentInstance.data = data;
    this.successDialog.componentInstance.isError = isError;
  }

  isNumberKey(evt: KeyboardEvent): boolean {
    return inputOnlyNumber(evt);
  }
}
