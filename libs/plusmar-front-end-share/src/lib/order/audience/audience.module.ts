import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
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
import { ITOPPLUSCDKModule, TimeAgoPipeModule } from '@reactor-room/itopplus-cdk';
import { AudienceComponent } from './audience.component';
import { AudienceRoutingModule } from './audience.routing';
import { HistoryDialogModule } from '@reactor-room/plusmar-front-end-share/audience/components/audience-history-dialog/history-dialog/history-dialog.module';
import { AudienceMessagesModule } from './components/audience-messages/audience-messages.module';
import { UserNullImagePipe } from './pipes/image.pipe';

registerLocaleData(localePt, 'th-TH');
const COMPONENTS = [AudienceComponent];
@NgModule({
  declarations: [COMPONENTS, UserNullImagePipe],
  imports: [
    ComponentModule,
    CommonModule,
    AudienceRoutingModule,
    ITOPPLUSCDKModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatSelectModule,
    MatMenuModule,
    TimeAgoPipeModule,
    TimeAgoPipeModule,
    MatDatepickerModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatMenuModule,
    HistoryDialogModule,
    AudienceMessagesModule,
  ],
})
export class AudienceModule {}
