import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { ITOPPLUSCDKModule } from '@reactor-room/itopplus-cdk';
import { OrderIdPipeModule } from '@reactor-room/plusmar-front-end-share/pipes/order-id.pipe.module';
import { SafePipeModule } from '@reactor-room/plusmar-front-end-share/pipes/safe.pipe.module';
import { StringCutterPipeModule } from '@reactor-room/plusmar-front-end-share/pipes/string-cutter.pipe.module';
import { ChatboxModule } from './chatbox/chatbox.module';
import { TemplatesModule } from './chatbox/templates/templates.module';
import { DisplayImageModule } from './display-image/display-image.module';
import { PeekboxModule } from './peekbox/peekbox.module';
import { SvgModule } from './svg/svg.module';
import { TagColorSelectorModule } from './tag-color-selector/tag-color-selector.module';
import { TrackingDialogModule } from './tracking-dialog/tracking-dialog.module';
import { UiBlockLoaderModule } from './ui-block-loader/ui-block-loader.module';

@NgModule({
  exports: [
    TagColorSelectorModule,
    TrackingDialogModule,
    SvgModule,
    DisplayImageModule,
    ChatboxModule,
    PeekboxModule,
    SafePipeModule,
    OrderIdPipeModule,
    StringCutterPipeModule,
    TemplatesModule,
    UiBlockLoaderModule,
  ],
  imports: [
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatMenuModule,
    ITOPPLUSCDKModule,
    TranslateModule,
    MatTabsModule,
    TagColorSelectorModule,
    TrackingDialogModule,
    SvgModule,
    DisplayImageModule,
    ChatboxModule,
    SafePipeModule,
    OrderIdPipeModule,
    StringCutterPipeModule,
    TemplatesModule,
    UiBlockLoaderModule,
  ],
  declarations: [],
})
export class ComponentModule {}
