import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { ITOPPLUSCDKModule } from '@reactor-room/itopplus-cdk';
import { AuthGuard } from '@reactor-room/plusmar-front-end-share/auth.guard';
import { ReportRoutingModule } from './report.routing';
//import {} from './components';
import { ReportComponent } from './report.component';
import { CustomTableModule, FilterModule } from '@reactor-room/plusmar-cdk';

registerLocaleData(localePt, 'th-TH');
const COMPONENTS = [ReportComponent];

@NgModule({
  declarations: [COMPONENTS],
  imports: [CommonModule, ITOPPLUSCDKModule, ReportRoutingModule, MatTabsModule, TranslateModule, FilterModule, CustomTableModule],
  providers: [AuthGuard],
})
export class ReportModule {}
