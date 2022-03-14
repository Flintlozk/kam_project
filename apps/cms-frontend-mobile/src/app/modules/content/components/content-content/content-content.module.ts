import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentContentComponent } from './content-content.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [ContentContentComponent],
  imports: [CommonModule, RouterModule, TranslateModule],
  exports: [ContentContentComponent],
})
export class ContentContentModule {}
