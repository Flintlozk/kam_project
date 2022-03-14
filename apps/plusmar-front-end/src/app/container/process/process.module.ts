import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ProcessComponent } from './process.component';

@NgModule({
  declarations: [ProcessComponent],
  imports: [TranslateModule],
  exports: [ProcessComponent],
})
export class ProcessModule {}
