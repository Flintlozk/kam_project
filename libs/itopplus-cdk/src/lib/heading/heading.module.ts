import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadingComponent } from './heading.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [HeadingComponent],
  exports: [HeadingComponent],
  imports: [CommonModule, TranslateModule],
})
export class HeadingModule {}
