import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuProfileComponent } from './menu-profile.component';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [MenuProfileComponent],
  imports: [CommonModule, MatInputModule],
  exports: [MenuProfileComponent],
})
export class MenuProfileModule {}
