import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ITOPPLUSCDKModule } from '@reactor-room/itopplus-cdk';
import { OrderDetailComponent } from './order-detail.component';
import { ComponentModule } from '@reactor-room/plusmar-front-end-share/components/component.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
registerLocaleData(localePt, 'th-TH');

@NgModule({
  declarations: [OrderDetailComponent],
  exports: [OrderDetailComponent],
  imports: [MatFormFieldModule, MatSelectModule, CommonModule, ComponentModule, TranslateModule, ITOPPLUSCDKModule, FormsModule, ReactiveFormsModule],
})
export class OrderDetailModule {}
