import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { AdminDashboardRoutingModule } from './admin-dashboard.routing';
import { AdminSlaStatisticModule } from '../../components/admin-sla-statistic/admin-sla-statistic.module';
import { AdminSlaAllStaffModule } from '../../components/admin-sla-all-staff/admin-sla-all-staff.module';
import { AdminReasonsClosedCaseModule } from '../../components/admin-reasons-closed-case/admin-reasons-closed-case.module';
import { HeadingModule } from '@reactor-room/itopplus-cdk';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { IntervalService } from '@reactor-room/plusmar-front-end-share/services/interval.service';

@NgModule({
  declarations: [AdminDashboardComponent],
  providers: [IntervalService],
  imports: [
    CommonModule,
    HeadingModule,
    AdminDashboardRoutingModule,
    AdminReasonsClosedCaseModule,
    AdminSlaAllStaffModule,
    AdminSlaStatisticModule,
    TranslateModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
})
export class AdminDashboardModule {}
