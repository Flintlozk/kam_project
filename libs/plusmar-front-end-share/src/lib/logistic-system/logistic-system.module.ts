import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogisticSystemComponent } from './logistic-system.component';
import { LogisticSystemService } from './logistic-system.service';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';

import { MatOptionValueModule } from '@reactor-room/plusmar-front-end-share/pipes/mat-option-value/mat-option-value.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [LogisticSystemComponent],
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule, MatFormFieldModule, TranslateModule, MatOptionValueModule],
  exports: [LogisticSystemComponent],
  providers: [LogisticSystemService],
})
export class LogisticSystemModule {}
