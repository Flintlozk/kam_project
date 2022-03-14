import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { ITOPPLUSCDKModule } from '@reactor-room/itopplus-cdk';
import { AuthGuard } from '@reactor-room/plusmar-front-end-share/auth.guard';
import { CreateSubscriptionPlanComponent } from './components/create-subscription/create-subscription-plan/create-subscription-plan.component';
import { CreateSubscriptionComponent } from './components/create-subscription/create-subscription.component';
import { UpgradeSubscriptionDialogComponent } from './components/upgrade-subscription-dialog/upgrade-subscription-dialog.component';
import { UpgradeSubscriptionBusinessComponent } from './components/upgrade-subscription-dialog/upgrade-subscription-business/upgrade-subscription-business.component';
import { UpgradeSubscriptionCommerceComponent } from './components/upgrade-subscription-dialog/upgrade-subscription-commerce/upgrade-subscription-commerce.component';
import { SubscriptionFeaturesComponent } from './components/subscription-features/subscription-features.component';
import { SubscriptionRoutingModule } from './subscription.routing';
import { SubscriptionPaymentComponent } from './components/subscription-payment/subscription-payment.component';
import { SubscriptionPaymentPlanBusinessComponent } from './components/subscription-payment/components/business/subscription-payment-plan-business.component';
import { SubscriptionPaymentPlanCommerceComponent } from './components/subscription-payment/components/commerce/subscription-payment-plan-commerce.component';
import { MoneyFormat } from './pipes/index';
import { AddressModule } from '@reactor-room/itopplus-cdk/address/address.module';
import { LanguageSwitchModule } from '@plusmar-front/container/language-switch/language-switch.module';

registerLocaleData(localePt, 'th-TH');
const COMPONENTS = [
  CreateSubscriptionComponent,
  CreateSubscriptionPlanComponent,
  UpgradeSubscriptionDialogComponent,
  UpgradeSubscriptionBusinessComponent,
  UpgradeSubscriptionCommerceComponent,
  SubscriptionPaymentComponent,
  SubscriptionPaymentPlanBusinessComponent,
  SubscriptionPaymentPlanCommerceComponent,
  SubscriptionFeaturesComponent,
];

@NgModule({
  declarations: [COMPONENTS, MoneyFormat],
  imports: [
    CommonModule,
    ITOPPLUSCDKModule,
    SubscriptionRoutingModule,
    MatTabsModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    TranslateModule,
    AddressModule,
    LanguageSwitchModule,
  ],
  exports: [UpgradeSubscriptionDialogComponent, UpgradeSubscriptionBusinessComponent, UpgradeSubscriptionCommerceComponent, MoneyFormat],
  providers: [AuthGuard],
})
export class SubscriptionModule {}
