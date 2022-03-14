import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableThemeComponent } from './table-theme.component';
import { MatPaginatorModule } from '@angular/material/paginator';

@NgModule({
  declarations: [TableThemeComponent],
  imports: [CommonModule, MatPaginatorModule],
  exports: [TableThemeComponent],
})
export class TableThemeModule {}
