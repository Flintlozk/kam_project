import { NgModule } from '@angular/core';
import { ProcessRequestComponent } from './process-request.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ProcessRequestComponent],
  imports: [TranslateModule],
  exports: [ProcessRequestComponent],
})
export class ProcessRequestModule {}
