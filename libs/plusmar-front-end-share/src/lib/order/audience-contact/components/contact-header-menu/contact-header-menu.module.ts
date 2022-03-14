import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactHeaderMenuComponent } from './contact-header-menu.component';

import { AudienceActionModule } from '@reactor-room/plusmar-front-end-share/order/audience/components/audience-action/audience-action.module';
import { OrderActionModule } from '@reactor-room/plusmar-front-end-share/order/follow-customer/components/order-action/order-action.module';
import { LeadsActionModule } from '@reactor-room/plusmar-front-end-share/order/leads/components/leads-action/leads-action.module';

import { ComponentLoaderModule } from '@reactor-room/itopplus-front-end-helpers';
import { ComponentLoaderService } from '@reactor-room/itopplus-front-end-helpers';

@NgModule({
  declarations: [ContactHeaderMenuComponent],
  exports: [ContactHeaderMenuComponent],
  imports: [CommonModule, AudienceActionModule, OrderActionModule, ComponentLoaderModule, LeadsActionModule],
  providers: [ComponentLoaderService],
})
export class ContactHeaderMenuModule {}
