import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { RouterModule } from '@angular/router';
import { HeaderModule } from '../header/header.module';
import { FooterModule } from '../footer/footer.module';
import { PwaCardModule } from '../pwa-card/pwa-card.module';

@NgModule({
  declarations: [LayoutComponent],
  imports: [CommonModule, RouterModule, HeaderModule, FooterModule, PwaCardModule],
  exports: [LayoutComponent],
})
export class LayoutModule {}
