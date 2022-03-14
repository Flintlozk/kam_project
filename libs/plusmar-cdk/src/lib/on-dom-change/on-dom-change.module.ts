import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnDomChangeDirective } from './on-dom-change.directive';

@NgModule({
  declarations: [OnDomChangeDirective],
  exports: [OnDomChangeDirective],
  imports: [CommonModule],
})
export class OnDomChangeModule {}
