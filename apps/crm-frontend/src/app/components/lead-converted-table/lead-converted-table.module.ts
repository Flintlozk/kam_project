import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeadConvertedTableComponent } from './lead-converted-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [LeadConvertedTableComponent],
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule],
  exports: [LeadConvertedTableComponent],
})
export class LeadConvertedTableModule {}
