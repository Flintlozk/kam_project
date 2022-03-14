import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountOptionComponent } from './account-option.component';
import { ClickOutsideModule } from '@reactor-room/itopplus-cdk';

@NgModule({
  declarations: [AccountOptionComponent],
  imports: [CommonModule, ClickOutsideModule],
  exports: [AccountOptionComponent],
})
export class AccountOptionModule {}
