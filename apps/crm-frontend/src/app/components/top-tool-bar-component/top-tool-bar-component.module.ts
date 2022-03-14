import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TopToolBarComponentComponent } from './top-tool-bar-component.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatMenuModule } from '@angular/material/menu';
import { MenuProfileComponent } from '../menu-profile/menu-profile.component';
import { MenuProfileModule } from '../menu-profile/menu-profile.module';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  declarations: [TopToolBarComponentComponent],
  imports: [CommonModule, MatToolbarModule, MatButtonToggleModule, MatMenuModule, MenuProfileModule, MatDividerModule],
  exports: [TopToolBarComponentComponent],
})
export class TopToolBarComponentModule {}
