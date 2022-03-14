import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadingModule } from '../../../../components/heading/heading.module';
import { InboxComponent } from './inbox.component';

@NgModule({
  declarations: [InboxComponent],
  imports: [CommonModule, HeadingModule],
  exports: [InboxComponent],
})
export class InboxModule {}
