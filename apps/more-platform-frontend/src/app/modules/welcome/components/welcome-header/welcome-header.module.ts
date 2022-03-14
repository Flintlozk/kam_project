import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { WelcomeHeaderComponent } from './welcome-header.component';
import { ClickOutsideModule } from '@reactor-room/itopplus-cdk';

@NgModule({
  declarations: [WelcomeHeaderComponent],
  imports: [CommonModule, RouterModule, ClickOutsideModule],
  exports: [WelcomeHeaderComponent],
})
export class WelcomeHeaderModule {}
