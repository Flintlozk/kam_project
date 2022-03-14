import { NgModule } from '@angular/core';
import { FacebookLoginComponent } from './facebook-login.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [FacebookLoginComponent],
  imports: [TranslateModule],
  exports: [FacebookLoginComponent],
})
export class FacebookLoginModule {}
