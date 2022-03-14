import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard.routing';
import { HeadingTitleModule } from '../../components/heading-title/heading-title.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [CommonModule, DashboardRoutingModule, HeadingTitleModule],
  exports: [DashboardComponent],
})
export class DashboardModule {}
