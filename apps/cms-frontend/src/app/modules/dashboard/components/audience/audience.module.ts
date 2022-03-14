import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AudienceComponent } from './audience.component';
import { TotalVisitorModule } from './components/total-visitor/total-visitor.module';
import { TrafficSourceModule } from './components/traffic-source/traffic-source.module';
import { DeviceModule } from './components/device/device.module';

import { WidgetClickModule } from './components/widget-click/widget-click.module';
import { RouterModule } from '@angular/router';
import { DashboardWebstatService } from '../../services/webstat/dashboard.webstat.service';

@NgModule({
  declarations: [AudienceComponent],
  imports: [CommonModule, TotalVisitorModule, TrafficSourceModule, DeviceModule, RouterModule, WidgetClickModule],
  exports: [AudienceComponent],
  providers: [DashboardWebstatService],
})
export class AudienceModule {}
