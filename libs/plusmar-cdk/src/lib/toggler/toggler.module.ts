import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TogglerComponent } from './toggler.component';

@NgModule({
  declarations: [TogglerComponent],
  imports: [CommonModule],
  exports: [TogglerComponent],
})
export class TogglerModule {}
