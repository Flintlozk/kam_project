import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { EnumAuthScope, ILineSetting } from '@reactor-room/itopplus-model-lib';
import * as _ from 'lodash';
import { debounceTime } from 'rxjs/operators';
import { SettingsService } from '@reactor-room/plusmar-front-end-share/services/settings/setting.service';
import { lineSettingErrorMessages, lineSettingValidationMessages } from './setting-line-dialog-validation.component';
// import { environment } from '../../../../../../../environments/environment';
import { SettingHowtoLineComponent } from '../setting-howto-line/setting-howto-line.component';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { environmentLib as environment } from '@reactor-room/environment-services-frontend';
@Component({
  selector: 'reactor-room-setting-line-dialog',
  templateUrl: './setting-line-dialog.component.html',
  styleUrls: ['./setting-line-dialog.component.scss'],
})
export class SettingLineDialogComponent implements OnInit {
  lineSettingForm: FormGroup;
  validationMessages = lineSettingValidationMessages;
  lineSettingErrorMessages = lineSettingErrorMessages;
  webhookUrl = '';
  theme: string;
  themeType = EnumAuthScope;
  isEditLine = false;
  constructor(
    public dialogRef: MatDialogRef<SettingLineDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    public translate: TranslateService,
    private settingsService: SettingsService,
    private router: Router,
  ) {
    this.initLineSettingForm();
  }

  ngOnInit(): void {
    this.theme = this.data;
    this.getLineChannelSettingByPageID();
  }

  initLineSettingForm(): void {
    this.lineSettingForm = this.formBuilder.group({
      basicid: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^@/)]],
      channelid: ['', [Validators.required, Validators.minLength(5), Validators.pattern(/[0-9]/)]],
      channelsecret: ['', [Validators.required, Validators.minLength(4)]],
      channeltoken: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  showErrorMessage(controlName: string, errorMessage: string): void {
    const errorProperty = `${controlName}ValidationMessage`;
    this.lineSettingErrorMessages[errorProperty] = errorMessage; //this.translate.instant(errorMessage);
  }

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  eventLookUpOnFocus(controlName: string): void {
    const lineSettingFormControl = this.lineSettingForm.get(controlName);
    lineSettingFormControl.valueChanges.pipe(debounceTime(500)).subscribe((value) => {
      this.setErrorMessageOnSubmit(lineSettingFormControl, controlName);
    });
  }

  connectLine(): void {
    if (this.lineSettingForm.valid) {
      const param = {
        basicid: this.lineSettingForm.controls['basicid'].value.trim(),
        channelid: Number(this.lineSettingForm.controls['channelid'].value),
        channelsecret: this.lineSettingForm.controls['channelsecret'].value.trim(),
        channeltoken: this.lineSettingForm.controls['channeltoken'].value.trim(),
        is_type_edit: this.isEditLine,
      } as ILineSetting;
      if (this.router.url === '/pages/edit') {
        this.setLineChannel(param);
      } else {
        this.verifyChannelAccessToken(param);
      }
    } else {
      const lineSettingControls = this.lineSettingForm.controls;

      _.forOwn(lineSettingControls, (control, key) => {
        if (control instanceof FormGroup) {
          const childFormGroup = control as FormGroup;
          const childFormControls = childFormGroup.controls;
          _.forOwn(childFormControls, (childFormControl, childKey) => {
            const childFormControlName = `${key}.${childKey}`;
            this.setErrorMessageOnSubmit(childFormControl, childFormControlName);
          });
        } else {
          this.setErrorMessageOnSubmit(control, key);
        }
      });
    }
  }

  verifyChannelAccessToken(linesetting: ILineSetting): void {
    this.settingsService.verifyChannelAccesstoken(linesetting.channeltoken, linesetting.channelid).subscribe(
      (result) => {
        linesetting.pictureurl = result.pictureurl;
        linesetting.premiumid = result.premiumid;
        linesetting.displayname = result.displayname;
        linesetting.userid = result.userid;
        this.dialogRef.close(linesetting);
      },
      (err) => {
        const errorMess = err.message.match(/INVALID_LINE_CHANNEL_ACCESS_TOKEN/)
          ? 'Invalid Channel Access Token'
          : err.message.match(/DUPPLICATE_LINE_CHANNEL/)
          ? 'This Line Official Account already used'
          : '';
        this.openAlertDialog({ text: errorMess, title: 'ERROR' }, true);
      },
    );
  }

  setLineChannel(linesetting: ILineSetting): void {
    this.settingsService.setLineChannelDetail(linesetting).subscribe(
      (result) => {
        const returnObject = {
          basicid: linesetting.basicid,
          channelid: linesetting.channelid,
          channelsecret: linesetting.channelsecret,
          channeltoken: linesetting.channeltoken,
          displayname: result.name,
          pictureurl: result.picture,
          premiumid: result.id,
        } as ILineSetting;
        this.dialogRef.close(returnObject);
      },
      (err) => {
        const errorMess = err.message.match(/INVALID_LINE_CHANNEL_ACCESS_TOKEN/)
          ? 'Invalid Channel Access Token'
          : err.message.match(/SET_CHANNEL_DETAIL_FAILED/)
          ? 'Update information failed'
          : err.message.match(/DUPPLICATE_LINE_CHANNEL/)
          ? 'This Line Official Account already used'
          : '';
        this.openAlertDialog({ text: errorMess, title: 'ERROR' }, true);
      },
    );
  }

  setErrorMessageOnSubmit(c: AbstractControl, controlName: string): void {
    if (c.errors) {
      const validationData = this.validationMessages.find((validation) => validation.control === controlName);
      const validationRules = validationData.rules;
      const errorMessage = Object.keys(c.errors)
        .map((key) => validationRules[key])
        .join('<br>');
      this.showErrorMessage(controlName, errorMessage);
    }
  }

  CopyLink(): void {
    const link = this.webhookUrl;
    const selBox = document.createElement('textarea');
    selBox.style.position = 'absolute';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = link;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.openAlertDialog(
      {
        text: link,
        title: this.translate.instant('Copied Successfully'),
      },
      false,
    );
  }

  openAlertDialog(message, isError: boolean): void {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    dialogRef.componentInstance.data = message;
    dialogRef.componentInstance.isError = isError;
  }

  getLineChannelSettingByPageID(): void {
    this.settingsService.getLineChannelSettingByPageID().subscribe((result) => {
      this.webhookUrl = `${environment.linewebhook}/${result.id}/${result.uuid}`;
      if (result.basicid !== null) {
        if (this.router.url === '/pages/edit') {
          this.isEditLine = true;
          this.lineSettingForm.controls['basicid'].setValue(result.basicid);
          this.lineSettingForm.controls['channelid'].setValue(result.channelid);
          this.lineSettingForm.controls['channelsecret'].setValue(result.channelsecret);
          this.lineSettingForm.controls['channeltoken'].setValue(result.channeltoken);
        }
      }
    });
  }

  openDialogHowtoConnectLine(): void {
    const dialogRef = this.dialog.open(SettingHowtoLineComponent, {
      width: isMobile() ? '90%' : '50%',
      height: '70%',
    });
  }
}
