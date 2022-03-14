import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SidebarNavComponent } from './sidebar-nav.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [SidebarNavComponent],
  imports: [CommonModule, MatMenuModule, MatInputModule],
  exports: [SidebarNavComponent],
})
export class SidebarNavModule {}
