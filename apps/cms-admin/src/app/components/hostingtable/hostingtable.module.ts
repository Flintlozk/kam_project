import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HostingtableComponent } from './hostingtable.component';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [HostingtableComponent],
  imports: [CommonModule, MatTableModule],
  exports: [HostingtableComponent],
})
export class HostingtableModule {}
