import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudienceDetailsComponent } from './audience-details.component';
import { HeadingModule } from '../../../../components/heading/heading.module';

@NgModule({
  declarations: [AudienceDetailsComponent],
  imports: [CommonModule, HeadingModule],
  exports: [AudienceDetailsComponent],
})
export class AudienceDetailsModule {}
