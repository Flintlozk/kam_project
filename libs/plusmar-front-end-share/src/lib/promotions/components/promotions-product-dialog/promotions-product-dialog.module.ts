import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PromotionsProductDialogComponent } from './promotions-product-dialog.component';
import { FormatCurrencyModule, ITOPPLUSCDKModule } from '@reactor-room/itopplus-cdk';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';
import { CustomTableModule } from '@reactor-room/plusmar-cdk';

@NgModule({
  declarations: [PromotionsProductDialogComponent],
  imports: [
    CommonModule,
    CommonModule,
    ITOPPLUSCDKModule,
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
  ],
  exports: [PromotionsProductDialogComponent],
})
export class PromotionsProductDialogModule {}
