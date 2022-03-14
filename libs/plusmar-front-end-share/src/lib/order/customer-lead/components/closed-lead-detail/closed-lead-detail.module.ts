import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClosedLeadDetailComponent } from './closed-lead-detail.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [ClosedLeadDetailComponent],
  imports: [CommonModule, MatTooltipModule],
  exports: [ClosedLeadDetailComponent],
})
export class ClosedLeadDetailModule {}
