import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { RouterModule } from '@angular/router';
import { HeaderModule } from '../header/header.module';
import { SidebarModule } from '../sidebar/sidebar.module';

@NgModule({
  declarations: [LayoutComponent],
  imports: [CommonModule, RouterModule, HeaderModule, SidebarModule],
  exports: [LayoutComponent],
})
export class LayoutModule {}
