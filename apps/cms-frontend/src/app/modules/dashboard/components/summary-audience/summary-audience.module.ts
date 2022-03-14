import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SummaryComponent } from './summary-audience.component';
import { DashboardWebstatService } from '../../services/webstat/dashboard.webstat.service';

@NgModule({
  declarations: [SummaryComponent],
  imports: [CommonModule],
  exports: [SummaryComponent],
  providers: [DashboardWebstatService],
})
export class SummaryModule {}
