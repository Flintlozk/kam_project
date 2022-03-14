import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ProfileHelpComponent } from './profile-help.component';

@NgModule({
  declarations: [ProfileHelpComponent],
  imports: [TranslateModule],
  exports: [ProfileHelpComponent],
})
export class ProfileHelpModule {}
