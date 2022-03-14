import { NgModule } from '@angular/core';
import { EmbeddedViewDirective } from './embedded-view.directive';

@NgModule({
  declarations: [EmbeddedViewDirective],
  exports: [EmbeddedViewDirective],
})
export class EmbeddedViewModule {}
