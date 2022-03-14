import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QueryRemoverPipe } from './queryremover.pipe';

@NgModule({
  declarations: [QueryRemoverPipe],
  imports: [CommonModule],
  exports: [QueryRemoverPipe],
})
export class QueryRemoverModule {}
