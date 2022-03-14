import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentFilterComponent } from './content-filter.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [ContentFilterComponent],
  imports: [CommonModule, RouterModule, TranslateModule],
  exports: [ContentFilterComponent],
})
export class ContentFilterModule {}
