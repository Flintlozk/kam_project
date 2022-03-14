import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NumberBundleComponent } from './number-bundle.component';
import { TimeAgoPipeModule } from '@reactor-room/itopplus-cdk';
@NgModule({
  declarations: [NumberBundleComponent],
  imports: [CommonModule, TimeAgoPipeModule],
  exports: [NumberBundleComponent],
})
export class NumberBundleModule {}
