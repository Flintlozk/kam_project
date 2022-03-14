import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormatCurrencyModule, ITOPPLUSCDKModule } from '@reactor-room/itopplus-cdk';
import { AuthGuard } from '@reactor-room/plusmar-front-end-share/auth.guard';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';

import { PromotionsRoutingModule } from './promotions.routing';

import { PromotionsComponent } from './promotions.component';

import { PromotionsCreateComponent } from './components';
import { TranslateModule } from '@ngx-translate/core';
import { CustomTableModule } from '@reactor-room/plusmar-cdk';
import { PromotionsProductDialogModule } from '@reactor-room/plusmar-front-end-share/promotions/components/promotions-product-dialog/promotions-product-dialog.module';

const COMPONENTS = [PromotionsComponent, PromotionsCreateComponent];

@NgModule({
  declarations: [COMPONENTS],
  imports: [
    CommonModule,
    ITOPPLUSCDKModule,
    PromotionsRoutingModule,
    MatSelectModule,
    MatMenuModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateModule,
    CustomTableModule,
    FormatCurrencyModule,
    PromotionsProductDialogModule,
  ],
  providers: [AuthGuard],
})
export class PromotionsModule {}
