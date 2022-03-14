import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { PlusModule } from '../icon/plus/plus.module';
import { SearchModule } from '../icon/search/search.module';
@NgModule({
  declarations: [HeaderComponent],
  imports: [CommonModule, PlusModule, SearchModule],
  exports: [HeaderComponent],
})
export class HeaderModule {}
