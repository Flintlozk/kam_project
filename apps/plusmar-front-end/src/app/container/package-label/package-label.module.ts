import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PackageLabelComponent } from './package-label.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [PackageLabelComponent],
  imports: [CommonModule, MatTooltipModule, RouterModule, TranslateModule],
  exports: [PackageLabelComponent],
})
export class PackageLabelModule {}
