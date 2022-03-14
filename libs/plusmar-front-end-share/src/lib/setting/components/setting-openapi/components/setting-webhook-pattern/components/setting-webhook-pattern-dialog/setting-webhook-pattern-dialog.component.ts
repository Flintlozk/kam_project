import { Component, OnInit, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { OpenApiService } from '@reactor-room/plusmar-front-end-share/services/settings/open-api.service';
import { IPageWebhookPatternSetting, EnumAuthError } from '@reactor-room/itopplus-model-lib';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk/success-dialog/success-dialog.component';

@Component({
  selector: 'reactor-room-setting-webhook-pattern-dialog',
  templateUrl: './setting-webhook-pattern-dialog.component.html',
  styleUrls: ['./setting-webhook-pattern-dialog.component.scss'],
})
export class SettingWebhookPatternDialogComponent implements OnInit {
  webhookPatternForm: FormGroup;
  mode: string;
  successDialog;
  selectStatus = false;

  constructor(
    public dialogRef: MatDialogRef<SettingWebhookPatternDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private openApiService: OpenApiService,
    private webhookFormBuilder: FormBuilder,
    public translate: TranslateService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.mode = this.data.mode;
    if (this.mode === 'EDIT') {
      const { name, url, regex_pattern } = this.data.webhookPattern as IPageWebhookPatternSetting;
      this.webhookPatternForm = this.webhookFormBuilder.group({
        name: [name, Validators.required],
        regex_pattern: [regex_pattern, Validators.required],
        url: [url, [Validators.required]],
      });
    } else {
      this.webhookPatternForm = this.webhookFormBuilder.group({
        name: ['', Validators.required],
        regex_pattern: ['', Validators.required],
        url: ['', [Validators.required]],
      });
    }
  }

  selectStatusToogle() {
    this.selectStatus = !this.selectStatus;
  }

  onSubmit(): void {
    if (this.webhookPatternForm.valid) {
      const params = {
        id: this.mode === 'ADD' ? null : this.data.webhookPattern.id,
        name: this.webhookPatternForm.value.name,
        url: this.webhookPatternForm.value.url,
        regex_pattern: this.webhookPatternForm.value.regex_pattern,
        status: this.mode === 'ADD' ? true : this.data.webhookPattern.status,
      } as IPageWebhookPatternSetting;
      if (this.mode === 'ADD') {
        this.openApiService.addWebhookPattern(params).subscribe(
          (res) => {
            this.dialogRef.close({ status: res });
          },
          (err) => {
            if (err.message.indexOf(EnumAuthError.PERMISSION_DENIED) !== -1) {
              this.openSuccessDialog(
                { text: this.translate.instant('Only owner and admin have permission to manage this part'), title: this.translate.instant('Permission denied') },
                true,
              );
            } else {
              console.log('err', err);
              this.openSuccessDialog(
                {
                  text: this.translate.instant(
                    'Something went wrong when trying to create webhook, please try again later. For more information, please contact us at 02-029-1200',
                  ),
                  title: this.translate.instant('Error'),
                },
                true,
              );
            }
          },
        );
      } else {
        this.openApiService.updateWebhookPattern(params).subscribe(
          (res) => {
            this.dialogRef.close({ status: res });
          },
          (err) => {
            this.openSuccessDialog(
              {
                text: this.translate.instant('Something went wrong when trying to update webhook, please try again later. For more information, please contact us at 02-029-1200'),
                title: this.translate.instant('Error'),
              },
              true,
            );
          },
        );
      }
    }
  }

  openSuccessDialog(data, isError = false): void {
    this.successDialog = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    this.successDialog.componentInstance.data = data;
    this.successDialog.componentInstance.isError = isError;
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
