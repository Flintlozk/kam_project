import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { TemplatesService } from '@reactor-room/plusmar-front-end-share/components/chatbox/templates/templates.service';
import { LeadsInfoComponent } from './leads-info.component';

@NgModule({
  declarations: [LeadsInfoComponent],
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, MatFormFieldModule],
  providers: [TemplatesService],
  exports: [LeadsInfoComponent],
})
export class LeadsInfoModule {}
