import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { EnumAuthScope, ThemeWithIPageMemberModel } from '@reactor-room/itopplus-model-lib';

@Component({
  selector: 'reactor-room-user-alias-name',
  templateUrl: './user-alias-name.component.html',
  styleUrls: ['./user-alias-name.component.scss'],
})
export class UserAliasNameComponent implements OnInit {
  aliasForm: FormGroup;
  theme: string;
  themeType = EnumAuthScope;
  constructor(
    public dialogRef: MatDialogRef<UserAliasNameComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ThemeWithIPageMemberModel,
    private formBuilder: FormBuilder,
    public translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.aliasForm = this.formBuilder.group({
      aliasName: [this.data.pageMemberModel.alias ? this.data.pageMemberModel.alias : ''],
    });
    this.theme = this.data.theme;
  }

  onClose(): void {
    this.dialogRef.close(false);
  }

  onSave(): void {
    if (this.aliasForm.valid && !this.aliasForm.pristine) {
      this.dialogRef.close(this.aliasForm.value);
    }
  }
}
