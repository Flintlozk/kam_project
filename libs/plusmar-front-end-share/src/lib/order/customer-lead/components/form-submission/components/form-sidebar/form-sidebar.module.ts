import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormSidebarComponent } from './form-sidebar.component';
import { CardModule } from '@reactor-room/itopplus-cdk';

@NgModule({
  declarations: [FormSidebarComponent],
  imports: [CommonModule, CardModule],
  exports: [FormSidebarComponent],
})
export class FormSidebarModule {}
