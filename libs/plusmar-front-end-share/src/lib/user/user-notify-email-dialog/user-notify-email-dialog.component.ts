import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { EnumAuthScope, IPageMemberModel, ThemeWithIPageMemberModel } from '@reactor-room/itopplus-model-lib';

@Component({
  selector: 'reactor-room-user-notify-email-dialog',
  templateUrl: './user-notify-email-dialog.component.html',
  styleUrls: ['./user-notify-email-dialog.component.scss'],
})
export class UserNotifyEmailDialogComponent implements OnInit {
  notifyForm: FormGroup;
  theme: string;
  themeType = EnumAuthScope;
  constructor(
    public dialogRef: MatDialogRef<UserNotifyEmailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ThemeWithIPageMemberModel,
    private formBuilder: FormBuilder,
    public translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.notifyForm = this.formBuilder.group({
      notifyEmail: [this.data.pageMemberModel.notify_email ? this.data.pageMemberModel.notify_email : '', Validators.email],
    });
    this.theme = this.data.theme;
  }

  onClose(): void {
    this.dialogRef.close(false);
  }

  onSave(): void {
    if (this.notifyForm.valid && !this.notifyForm.pristine) {
      this.dialogRef.close(this.notifyForm.value);
    }
  }
}
