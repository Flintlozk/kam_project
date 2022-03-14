import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadTableComponent } from './lead-table.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { TranslateModule } from '@ngx-translate/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [LeadTableComponent],
  imports: [CommonModule, MatTableModule, MatPaginatorModule, TranslateModule, MatCheckboxModule, MatButtonModule],
  exports: [LeadTableComponent],
})
export class LeadTableModule {}
