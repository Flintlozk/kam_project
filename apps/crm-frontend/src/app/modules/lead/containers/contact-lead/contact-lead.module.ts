import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadFormModule } from '../../../../components/lead-form/lead-form.module';
import { ContactLeadComponent } from './contact-lead.component';
import { SidebarNavModule } from '../../../../components/sidebar-nav/sidebar-nav.module';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { ITOPPLUSCDKModule, StatusDialogModule } from '@reactor-room/itopplus-cdk';
import { MatDialogModule } from '@angular/material/dialog';

import { TaskDetailModule } from '../../../../components/task-detail/task-detail.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatPaginatorModule } from '@angular/material/paginator';
import { LeadConvertedTableModule } from '../../../../components/lead-converted-table/lead-converted-table.module';
import { LeadTableModule } from '../../../../components/lead-table/lead-table.module';
import { ModalConfirmDeleteModule } from '../../../../components/modal-confirm-delete/modal-confirm-delete.module';

@NgModule({
  declarations: [ContactLeadComponent],
  imports: [
    CommonModule,
    LeadFormModule,
    SidebarNavModule,
    MatSidenavModule,
    MatTableModule,
    MatButtonModule,
    MatCheckboxModule,
    ITOPPLUSCDKModule,
    MatDialogModule,
    StatusDialogModule,
    TaskDetailModule,
    TranslateModule,
    MatPaginatorModule,
    LeadConvertedTableModule,
    LeadTableModule,
    ModalConfirmDeleteModule,
  ],
  exports: [ContactLeadComponent],
})
export class ContactLeadModule {}
