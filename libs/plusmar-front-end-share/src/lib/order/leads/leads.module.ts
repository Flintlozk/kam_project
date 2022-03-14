import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentModule } from '@reactor-room/plusmar-front-end-share/components/component.module';
import { ITOPPLUSCDKModule } from '@reactor-room/itopplus-cdk';
import { CustomTableContentModule, CustomTableModule, FilterModule } from '@reactor-room/plusmar-cdk';
import { FilterDateService } from '@reactor-room/plusmar-front-end-share/services/filter-date.service';
import {
  LeadsCreateFormComponent,
  LeadsFollowComponent,
  LeadsFormComponent,
  LeadsFormDefaultComponent,
  // LeadsInfoComponent,
  LeadsNewFormComponent,
} from './components';
import { LeadsCreateFormDesignComponent, LeadsCreateFormViewComponent } from './components/leads-create-form/components';
import { LeadsFinishedModule } from './components/leads-finished/leads-finished.module';
import { LeadsFormEditorModule } from './components/leads-form-editor/leads-form-editor.module';
import { LeadsInfoCloseModule } from './components/leads-info-close/leads-info-close.module';
import { LeadsNewFormContactComponent, LeadsNewFormSidebarComponent } from './components/leads-new-form/components';
import { FormsComponent, LeadsComponent } from './containers';
import { CloseLeadInfoModule } from './containers/close-lead-info/close-lead-info.module';
import { LeadsRoutingModule } from './leads.routing';
import { LeadsCreateFormService } from './services/leads-create-form.service';
import { LeadsFormService } from './services/leads-form.service';

registerLocaleData(localePt, 'th-TH');

const COMPONENTS = [
  LeadsComponent,
  // LeadsFinishedComponent,
  LeadsFollowComponent,
  // LeadsInfoComponent,
  LeadsNewFormComponent,
  LeadsNewFormContactComponent,
  LeadsNewFormSidebarComponent,
  LeadsFormComponent,
  LeadsFormDefaultComponent,
  LeadsCreateFormComponent,
  LeadsCreateFormViewComponent,
  LeadsCreateFormDesignComponent,
];

@NgModule({
  declarations: [COMPONENTS, FormsComponent],
  imports: [
    CommonModule,
    ComponentModule,
    LeadsRoutingModule,
    ITOPPLUSCDKModule,
    FormsModule,
    ReactiveFormsModule,
    MatTabsModule,
    DragDropModule,
    MatMenuModule,
    MatFormFieldModule,
    MatSelectModule,
    TranslateModule,
    LeadsInfoCloseModule,
    LeadsFormEditorModule,
    CloseLeadInfoModule,
    LeadsFinishedModule,
    CustomTableModule,
    FilterModule,
    CustomTableContentModule,
  ],
  providers: [LeadsCreateFormService, FilterDateService, LeadsFormService],
})
export class LeadsModule {}
