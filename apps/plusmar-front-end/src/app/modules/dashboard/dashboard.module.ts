import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ITOPPLUSCDKModule } from '@reactor-room/itopplus-cdk';
import { FilterModule } from '@reactor-room/plusmar-cdk';
import { AuthGuard } from '@reactor-room/plusmar-front-end-share/auth.guard';
import {
  DashboardAudienceComponent,
  DashboardCustomersComponent,
  DashboardCustomerServiceComponent,
  DashboardLeadsComponent,
  DashboardLeadStepsComponent,
  PagesThirdPartyReconnectDialogModule,
  TotalCustomersComponent,
  TotalLeadsComponent,
  TotalPotentialCustomersComponent,
  TotalRefundReturnComponent,
  TotalRevenueComponent,
  TotalUnpaidComponent,
} from './components';
// Register the localization
import { TotalAudienceComponent } from './components/total-audience/total-audience.component';
import { TotalCustomerSlaComponent } from './components/total-customer-sla/total-customer-sla.component';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard.routing';

registerLocaleData(localePt, 'th-TH');

const COMPONENTS = [
  TotalPotentialCustomersComponent,
  TotalAudienceComponent,
  TotalCustomersComponent,
  TotalRevenueComponent,
  TotalUnpaidComponent,
  TotalLeadsComponent,
  TotalRefundReturnComponent,
  DashboardComponent,
  DashboardCustomerServiceComponent,
  DashboardCustomersComponent,
  DashboardLeadsComponent,
  DashboardAudienceComponent,
  DashboardLeadStepsComponent,
  TotalCustomerSlaComponent,
];

@NgModule({
  declarations: [COMPONENTS],
  imports: [CommonModule, DashboardRoutingModule, ITOPPLUSCDKModule, TranslateModule, PagesThirdPartyReconnectDialogModule, FilterModule],
  providers: [
    AuthGuard,
    {
      provide: LOCALE_ID,
      useValue: 'th-TH',
    },
    {
      provide: DEFAULT_CURRENCY_CODE,
      useValue: 'th-TH',
    },
  ],
  exports: [COMPONENTS],
})
export class DashboardModule {}
