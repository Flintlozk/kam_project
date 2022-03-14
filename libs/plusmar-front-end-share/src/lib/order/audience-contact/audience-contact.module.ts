import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { ITOPPLUSCDKModule, TimeAgoPipeModule } from '@reactor-room/itopplus-cdk';
import { AddToCalendarModule } from '@reactor-room/plusmar-front-end-share/components/add-to-calendar/add-to-calendar.module';
import { ComponentModule } from '@reactor-room/plusmar-front-end-share/components/component.module';
import { UiBlockLoaderModule } from '@reactor-room/plusmar-front-end-share/components/ui-block-loader/ui-block-loader.module';
import { CustomerAssigneeModule } from '@reactor-room/plusmar-front-end-share/customer/components/customer-assignee/customer-assignee.module';
import { CustomerAudienceTagsModule } from '@reactor-room/plusmar-front-end-share/customer/components/customer-audience-tags/customer-audience-tags.module';
import { CustomerNotesModule } from '@reactor-room/plusmar-front-end-share/customer/components/customer-notes/customer-notes.module';
import { AudienceActionModule } from '@reactor-room/plusmar-front-end-share/order/audience/components/audience-action/audience-action.module';
import { OrderActionModule } from '@reactor-room/plusmar-front-end-share/order/follow-customer/components/order-action/order-action.module';
import { PurchaseCartModule } from '@reactor-room/plusmar-front-end-share/order/follow-customer/components/purchase-cart/purchase-cart.module';
import { OrderDetailModule } from '@reactor-room/plusmar-front-end-share/order/follow-customer/containers/order-detail/order-detail.module';
import { OrderService } from '@reactor-room/plusmar-front-end-share/order/follow-customer/services/order.service';
import { TokenGeneratorService } from '@reactor-room/plusmar-front-end-share/services/token-generater.service';
import { CustomerLeadModule } from '../customer-lead/customer-lead.module';
// import { FormSubmissionModule } from '../customer-lead/components/form-submission/form-submission.module';
// import { LeadFormListModule } from '../customer-lead/components/lead-form-list/lead-form-list.module';
import { LeadsActionModule } from '../leads/components/leads-action/leads-action.module';
import { LeadsFormService } from '../leads/services/leads-form.service';
import { QuickPayModule } from '../quick-pay/quick-pay.module';
import { AudienceContactComponent } from './audience-contact.component';
import { AudienceContactRoutingModule } from './audience-contact.routing';
import { AudiencePostModule } from './audience-post/audience-post.module';
import { AudienceContactListModule } from './components/audience-contact-list/audience-contact-list.module';
import { ContactChatMenuModule } from './components/contact-chat-menu/contact-chat-menu.module';
import { ContactHeaderMenuModule } from './components/contact-header-menu/contact-header-menu.module';

@NgModule({
  imports: [
    AudiencePostModule,
    ComponentModule,
    CommonModule,
    AudienceContactRoutingModule,
    AudienceContactListModule,
    ITOPPLUSCDKModule,
    TranslateModule,
    TimeAgoPipeModule,
    ContactHeaderMenuModule,
    ContactChatMenuModule,
    AudienceActionModule,
    LeadsActionModule,
    OrderActionModule,
    OrderDetailModule,
    AddToCalendarModule,
    PurchaseCartModule,
    CustomerAssigneeModule,
    CustomerAudienceTagsModule,
    CustomerNotesModule,
    // FormSubmissionModule,
    // LeadFormListModule,
    CustomerLeadModule,
    MatTabsModule,
    QuickPayModule,
    UiBlockLoaderModule,
  ],
  declarations: [AudienceContactComponent],
  providers: [OrderService, LeadsFormService, TokenGeneratorService],
})
export class AudienceContactModule {}
