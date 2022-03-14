import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentModule } from '@reactor-room/plusmar-front-end-share/components/component.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ITOPPLUSCDKModule } from '@reactor-room/itopplus-cdk';
import { RegisterComponent } from './register.component';
import { RegisterRoutingModule } from './register.routing';

import { RegisterPhoneNumberFormComponent, RegisterOTPFormComponent } from './components';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [RegisterComponent, RegisterPhoneNumberFormComponent, RegisterOTPFormComponent],
  imports: [RegisterRoutingModule, CommonModule, ComponentModule, FormsModule, ReactiveFormsModule, TranslateModule, ITOPPLUSCDKModule],
})
export class RegisterModule {}
