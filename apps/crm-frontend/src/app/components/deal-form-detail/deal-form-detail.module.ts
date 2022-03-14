import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DealFormDetailComponent } from './deal-form-detail.component';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { FormEditDealModule } from '../form-edit-deal/form-edit-deal.module';
import { ModalErrorModule } from '../modal-error/modal-error.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [DealFormDetailComponent],
  imports: [CommonModule, MatCardModule, MatDialogModule, FormEditDealModule, ModalErrorModule, MatTooltipModule, MatIconModule],
  exports: [DealFormDetailComponent],
})
export class DealFormDetailModule {}
