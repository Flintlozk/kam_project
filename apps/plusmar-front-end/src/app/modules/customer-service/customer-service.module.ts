import { CommonModule, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { ITOPPLUSCDKModule } from '@reactor-room/itopplus-cdk';
import { CustomTableModule, QuillEditorModule } from '@reactor-room/plusmar-cdk';
import { AuthGuard } from '@reactor-room/plusmar-front-end-share/auth.guard';
import {
  CustomerServiceCloseListComponent,
  CustomerServiceCreateIssueComponent,
  CustomerServiceIssueInfoComponent,
  CustomerServiceIssueListComponent,
  CustomerServiceIssueTypeDialogComponent,
  CustomerServiceSendEmailDialogComponent,
} from './components';
import { CustomerServiceComponent } from './customer-service.component';
import { CustomerServiceRoutingModule } from './customer-service.routing';
import { IssueService } from './services';

registerLocaleData(localePt, 'th-TH');

const COMPONENTS = [
  CustomerServiceComponent,
  CustomerServiceIssueListComponent,
  CustomerServiceCloseListComponent,
  CustomerServiceIssueTypeDialogComponent,
  CustomerServiceSendEmailDialogComponent,
  CustomerServiceCreateIssueComponent,
  CustomerServiceIssueInfoComponent,
];

@NgModule({
  declarations: [COMPONENTS],
  imports: [
    CommonModule,
    ITOPPLUSCDKModule,
    CustomerServiceRoutingModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatIconModule,
    MatTabsModule,
    TranslateModule,
    CustomTableModule,
    QuillEditorModule,
  ],
  providers: [AuthGuard, IssueService],
})
export class CustomerServiceModule {}
