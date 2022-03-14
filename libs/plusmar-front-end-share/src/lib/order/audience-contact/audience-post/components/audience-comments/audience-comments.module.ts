import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentModule } from '@reactor-room/plusmar-front-end-share/components/component.module';
import { TimeAgoPipeModule } from '@reactor-room/itopplus-cdk';
import { AudienceCommentsComponent } from './audience-comments.component';
import { TemplatesService } from '@reactor-room/plusmar-front-end-share/components/chatbox/templates/templates.service';

@NgModule({
  declarations: [AudienceCommentsComponent],
  exports: [AudienceCommentsComponent],
  providers: [TemplatesService],
  imports: [CommonModule, ComponentModule, FormsModule, ReactiveFormsModule, TimeAgoPipeModule, TranslateModule],
})
export class AudienceCommentsModule {}
