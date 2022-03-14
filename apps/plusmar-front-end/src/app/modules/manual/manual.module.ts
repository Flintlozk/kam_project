import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentModule } from '@reactor-room/plusmar-front-end-share/components/component.module';
import { ITOPPLUSCDKModule } from '@reactor-room/itopplus-cdk';
import { ManualRoutingModule } from './manual.routing';
import { ChangePrimaryEmailInfoComponent, AddEmailInfoComponent } from './components';

import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ChangePrimaryEmailInfoComponent, AddEmailInfoComponent],
  imports: [ManualRoutingModule, CommonModule, ComponentModule, TranslateModule, ITOPPLUSCDKModule],
})
export class ManualModule {}
