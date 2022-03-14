import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentModule } from '@reactor-room/plusmar-front-end-share/components/component.module';
import { ITOPPLUSCDKModule } from '@reactor-room/itopplus-cdk/itopplus-cdk.module';
import { TimeAgoPipeModule } from '@reactor-room/itopplus-cdk/time-ago-pipe/time-ago.module';
import { OnDomChangeModule } from '@reactor-room/plusmar-cdk';
import { AudiencePostComponent } from './audience-post.component';
import { AudienceCommentsModule } from './components/audience-comments/audience-comments.module';
import { TextTrimModule } from '@reactor-room/itopplus-cdk/text-trim/text-trim.module';
import { LoaderModule } from '@reactor-room/itopplus-cdk';

@NgModule({
  imports: [
    ComponentModule,
    CommonModule,
    ITOPPLUSCDKModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatMenuModule,
    MatDatepickerModule,
    TimeAgoPipeModule,
    TranslateModule,
    MatDatepickerModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatMenuModule,
    AudienceCommentsModule,
    OnDomChangeModule,
    TextTrimModule,
    LoaderModule,
  ],
  exports: [AudiencePostComponent],
  declarations: [AudiencePostComponent],
  providers: [],
})
export class AudiencePostModule {}
