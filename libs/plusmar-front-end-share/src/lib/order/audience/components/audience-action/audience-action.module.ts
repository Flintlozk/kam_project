import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { ComponentModule } from '@reactor-room/plusmar-front-end-share/components/component.module';
import { ITOPPLUSCDKModule } from '@reactor-room/itopplus-cdk';
import { AudienceActionComponent } from './audience-action.component';
import { CustomerClosedReasonModule } from '@reactor-room/plusmar-front-end-share/customer/components/customer-closed-reason/customer-closed-reason.module';

@NgModule({
  declarations: [AudienceActionComponent],
  exports: [AudienceActionComponent],
  imports: [CommonModule, TranslateModule, ComponentModule, ITOPPLUSCDKModule, CustomerClosedReasonModule],
})
export class AudienceActionModule {}
