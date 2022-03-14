import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomainComponent } from './domain.component';
import { TableThemeModule } from '../../../../components/table-theme/table-theme.module';
import { DashboardWebstatService } from '../../services/webstat/dashboard.webstat.service';

@NgModule({
  declarations: [DomainComponent],
  imports: [CommonModule, TableThemeModule],
  exports: [DomainComponent],
  providers: [DashboardWebstatService],
})
export class DomainModule {}
