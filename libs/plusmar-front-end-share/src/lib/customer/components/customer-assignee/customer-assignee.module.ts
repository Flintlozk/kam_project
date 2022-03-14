import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerAssigneeComponent } from './customer-assignee.component';
import { ClickOutsideModule } from '@reactor-room/itopplus-cdk';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [CustomerAssigneeComponent],
  imports: [FormsModule, CommonModule, ClickOutsideModule, TranslateModule],
  exports: [CustomerAssigneeComponent],
})
export class CustomerAssigneeModule {}
