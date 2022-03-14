import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadsActionComponent } from './leads-action.component';

import { TranslateModule } from '@ngx-translate/core';

import { ITOPPLUSCDKModule } from '@reactor-room/itopplus-cdk';
import { ComponentModule } from '@reactor-room/plusmar-front-end-share/components/component.module';

@NgModule({
  declarations: [LeadsActionComponent],
  exports: [LeadsActionComponent],
  imports: [CommonModule, TranslateModule, ITOPPLUSCDKModule, ComponentModule],
})
export class LeadsActionModule {}
