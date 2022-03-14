import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportFollowCustomerComponent } from './report-follow-customer.component';
import { CardModule, LoaderModule } from '@reactor-room/itopplus-cdk';
import { TranslateModule } from '@ngx-translate/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { SafePipe } from './safe.pipe';
@NgModule({
  declarations: [ReportFollowCustomerComponent, SafePipe],
  imports: [CommonModule, CardModule, TranslateModule, MatFormFieldModule, MatSelectModule, MatOptionModule, LoaderModule],
  exports: [ReportFollowCustomerComponent],
})
export class ReportFollowCustomerModule {}
