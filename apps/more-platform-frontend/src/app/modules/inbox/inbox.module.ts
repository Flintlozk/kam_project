import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InboxComponent } from './inbox.component';
import { InboxRoutingModule } from './inbox.routing.module';
import { HeadingTitleModule } from '../../components/heading-title/heading-title.module';

@NgModule({
  declarations: [InboxComponent],
  imports: [CommonModule, InboxRoutingModule, HeadingTitleModule],
  exports: [InboxComponent],
})
export class InboxModule {}
