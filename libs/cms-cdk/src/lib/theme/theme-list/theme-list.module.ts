import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeListComponent } from './theme-list.component';

@NgModule({
  declarations: [ThemeListComponent],
  imports: [CommonModule],
  exports: [ThemeListComponent],
})
export class ThemeListModule {}
