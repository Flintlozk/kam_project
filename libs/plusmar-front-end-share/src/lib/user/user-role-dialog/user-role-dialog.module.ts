import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoleDialogComponent } from './user-role-dialog.component';

import { TranslateModule } from '@ngx-translate/core';
import { CustomDialogModule } from '@reactor-room/itopplus-cdk';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [UserRoleDialogComponent],
  imports: [CommonModule, TranslateModule, CustomDialogModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule],
  exports: [UserRoleDialogComponent],
})
export class UserRoleDialogModule {}
