import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { EnumAuthScope, EnumPageMemberType, IPageMemberModel, ThemeWithIPageMemberModel } from '@reactor-room/itopplus-model-lib';

@Component({
  selector: 'reactor-room-user-role-dialog',
  templateUrl: './user-role-dialog.component.html',
  styleUrls: ['./user-role-dialog.component.scss'],
})
export class UserRoleDialogComponent implements OnInit {
  theme: string;
  themeType = EnumAuthScope;
  EnumPageMemberType = EnumPageMemberType;
  roles = [
    { value: 'ADMIN', name: 'Admin' },
    { value: 'STAFF', name: 'Staff' },
  ];
  user: IPageMemberModel;
  allowSaveOnChange = false;
  currentSelectedRole: EnumPageMemberType;
  constructor(public dialogRef: MatDialogRef<UserRoleDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: ThemeWithIPageMemberModel, public translate: TranslateService) {}

  ngOnInit(): void {
    this.user = this.data.pageMemberModel;
    this.theme = this.data.theme;
    this.currentSelectedRole = this.data.pageMemberModel.role;
  }

  onClose(): void {
    this.dialogRef.close(false);
  }

  onSave(): void {
    if (this.allowSaveOnChange) {
      this.dialogRef.close(this.currentSelectedRole);
    }
  }

  selectedNewRole(role: EnumPageMemberType): void {
    this.allowSaveOnChange = true;
    this.currentSelectedRole = role;
  }
}
