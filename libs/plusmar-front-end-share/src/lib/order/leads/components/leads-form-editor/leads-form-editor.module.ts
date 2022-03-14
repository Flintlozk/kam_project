import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { ITOPPLUSCDKModule } from '@reactor-room/itopplus-cdk';
import { ComponentModule } from '@reactor-room/plusmar-front-end-share/components/component.module';

import { LeadsFormEditorComponent } from './leads-form-editor.component';

@NgModule({
  declarations: [LeadsFormEditorComponent],
  exports: [LeadsFormEditorComponent],
  imports: [CommonModule, TranslateModule, FormsModule, ReactiveFormsModule, ITOPPLUSCDKModule, ComponentModule],
})
export class LeadsFormEditorModule {}
