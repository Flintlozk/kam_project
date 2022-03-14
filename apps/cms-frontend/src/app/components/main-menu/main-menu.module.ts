import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainMenuComponent } from './main-menu.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [MainMenuComponent],
  imports: [CommonModule, RouterModule],
  exports: [MainMenuComponent],
})
export class MainMenuModule {}
