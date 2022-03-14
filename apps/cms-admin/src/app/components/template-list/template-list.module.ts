import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { templateListComponent } from './template-list.component';
import { PagePaginationModule } from '@reactor-room/cms-cdk';

@NgModule({
  declarations: [templateListComponent],
  imports: [CommonModule, PagePaginationModule],
  exports: [templateListComponent],
})
export class templateListModule {}
