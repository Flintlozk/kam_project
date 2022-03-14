import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActiveUserComponent } from './active-user.component';
import { HeadingModule } from '../../../../components/heading/heading.module';

@NgModule({
  declarations: [ActiveUserComponent],
  imports: [CommonModule, HeadingModule],
  exports: [ActiveUserComponent],
})
export class ActiveUserModule {}
