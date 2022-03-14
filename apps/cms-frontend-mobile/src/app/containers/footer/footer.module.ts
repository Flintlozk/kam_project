import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer.component';
import { FirstGuideModule } from '../first-guide/first-guide.module';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [FooterComponent],
  imports: [CommonModule, FirstGuideModule, RouterModule, TranslateModule],
  exports: [FooterComponent],
})
export class FooterModule {}
