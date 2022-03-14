import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudienceStatusPipe } from './audience-status.pipe';

@NgModule({
  declarations: [AudienceStatusPipe],
  imports: [CommonModule],
  exports: [AudienceStatusPipe],
})
export class AudienceStatusModule {}
