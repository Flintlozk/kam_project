import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeIntroComponent } from './welcome-intro.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [WelcomeIntroComponent],
  imports: [CommonModule, TranslateModule],
  exports: [WelcomeIntroComponent],
})
export class WelcomeIntroModule {}
