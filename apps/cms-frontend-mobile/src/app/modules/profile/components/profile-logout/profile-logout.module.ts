import { NgModule } from '@angular/core';
import { ProfileLogoutComponent } from './profile-logout.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ProfileLogoutComponent],
  imports: [RouterModule, RouterModule, TranslateModule],
  exports: [ProfileLogoutComponent],
})
export class ProfileLogoutModule {}
