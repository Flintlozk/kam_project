import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from '@reactor-room/itopplus-cdk';
import { TagColorSelectorComponent } from './tag-color-selector.component';

@NgModule({
  declarations: [TagColorSelectorComponent],
  imports: [CommonModule, CardModule],
  exports: [TagColorSelectorComponent],
})
export class TagColorSelectorModule {}
