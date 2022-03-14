import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TrashComponent } from './trash.component';
import { HeadingModule } from '../../../../components/heading/heading.module';

@NgModule({
  declarations: [TrashComponent],
  imports: [CommonModule, HeadingModule],
  exports: [TrashComponent],
})
export class TrashModule {}
