import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirstGuideComponent } from './first-guide.component';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [FirstGuideComponent],
  imports: [CommonModule, TranslateModule],
  exports: [FirstGuideComponent],
})
export class FirstGuideModule {}
