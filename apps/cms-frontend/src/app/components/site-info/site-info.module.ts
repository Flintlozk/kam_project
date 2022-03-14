import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteInfoComponent } from './site-info.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [SiteInfoComponent],
  imports: [CommonModule, MatSelectModule, MatFormFieldModule],
  exports: [SiteInfoComponent],
})
export class SiteInfoModule {}
