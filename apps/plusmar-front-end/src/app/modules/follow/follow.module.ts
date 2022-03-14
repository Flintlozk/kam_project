import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ITOPPLUSCDKModule } from '@reactor-room/itopplus-cdk';
import { ComponentModule } from '@reactor-room/plusmar-front-end-share/components/component.module';

import { FollowComponent } from './follow.component';
import { FollowRoutingModule } from './follow.routing';
import { FollowListComponent } from './components/follow-list/follow-list.component';
import { CustomTableContentModule, CustomTableModule } from '@reactor-room/plusmar-cdk';
import { AudienceContactFilterModule } from '@reactor-room/plusmar-front-end-share/order/audience-contact/components/audience-contact-filter/audience-contact-filter.module';
import { TextTrimModule } from '@reactor-room/itopplus-cdk/text-trim/text-trim.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AudienceStatusModule } from '@reactor-room/plusmar-front-end-share/pipes/audience-status/audience-status.module';
import { IntervalService } from '@reactor-room/plusmar-front-end-share/services/interval.service';
import { PeekboxModule } from '@reactor-room/plusmar-front-end-share/components/peekbox/peekbox.module';

registerLocaleData(localePt, 'th-TH');

const COMPONENTS = [FollowComponent, FollowListComponent];

@NgModule({
  declarations: [COMPONENTS],
  imports: [
    CommonModule,
    FollowRoutingModule,
    AudienceContactFilterModule,
    TranslateModule,
    ITOPPLUSCDKModule,
    ComponentModule,
    FormsModule,
    ReactiveFormsModule,
    CustomTableModule,
    CustomTableContentModule,
    TextTrimModule,
    MatTooltipModule,
    PeekboxModule,
    AudienceStatusModule,
  ],
  providers: [IntervalService],
})
export class FollowModule {}
