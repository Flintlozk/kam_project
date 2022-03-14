import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomChipsComponent } from './custom-chips.component';
import { LoaderModule } from '@reactor-room/itopplus-cdk';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [CustomChipsComponent],
  imports: [CommonModule, LoaderModule, MatFormFieldModule, MatChipsModule, MatIconModule],
  exports: [CustomChipsComponent],
})
export class CustomChipsModule {}
