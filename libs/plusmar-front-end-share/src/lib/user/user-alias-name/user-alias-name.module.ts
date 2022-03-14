import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAliasNameComponent } from './user-alias-name.component';
import { TranslateModule } from '@ngx-translate/core';
import { CustomDialogModule } from '@reactor-room/itopplus-cdk';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [UserAliasNameComponent],
  imports: [CommonModule, TranslateModule, CustomDialogModule, FormsModule, ReactiveFormsModule, MatFormFieldModule],
  exports: [UserAliasNameComponent],
})
export class UserAliasNameModule {}
