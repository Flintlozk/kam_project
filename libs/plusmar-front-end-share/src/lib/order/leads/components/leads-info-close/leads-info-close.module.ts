import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentModule } from '@reactor-room/plusmar-front-end-share/components/component.module';
import { ITOPPLUSCDKModule } from '@reactor-room/itopplus-cdk';
import { LeadsInfoCloseComponent } from './leads-info-close.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [LeadsInfoCloseComponent],
  exports: [LeadsInfoCloseComponent],
  imports: [CommonModule, TranslateModule, MatTooltipModule, FormsModule, MatFormFieldModule, ReactiveFormsModule, ITOPPLUSCDKModule, ComponentModule],
})
export class LeadsInfoCloseModule {}
