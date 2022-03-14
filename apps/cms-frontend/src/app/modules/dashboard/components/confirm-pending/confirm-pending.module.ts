import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmPendingComponent } from './confirm-pending.component';
import { HeadingModule } from '../../../../components/heading/heading.module';

@NgModule({
  declarations: [ConfirmPendingComponent],
  imports: [CommonModule, HeadingModule],
  exports: [ConfirmPendingComponent],
})
export class ConfirmPendingModule {}
