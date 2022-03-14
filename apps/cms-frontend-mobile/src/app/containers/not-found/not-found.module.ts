import { NgModule } from '@angular/core';
import { NotFoundComponent } from './not-found.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [NotFoundComponent],
  imports: [RouterModule, TranslateModule],
  exports: [NotFoundComponent],
})
export class NotFoundModule {}
