import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormEditDealComponent } from './form-edit-deal.component';
import { DealFormModule } from '../deal-form/deal-form.module';
import { MatCardModule } from '@angular/material/card';
import { TaskCardModule } from '../task-card/task-card.module';
import { TextFieldModule } from '@angular/cdk/text-field';

@NgModule({
  declarations: [FormEditDealComponent],
  imports: [CommonModule, DealFormModule, MatCardModule, TaskCardModule, TextFieldModule],
  exports: [FormEditDealComponent],
})
export class FormEditDealModule {}
