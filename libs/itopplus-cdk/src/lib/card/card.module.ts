import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './card.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [CardComponent],
  imports: [CommonModule, RouterModule, TranslateModule],
  exports: [CardComponent],
})
export class CardModule {}
