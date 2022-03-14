import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ParamsRemoverPipe } from './params-remover.pipe';

@NgModule({
  declarations: [ParamsRemoverPipe],
  imports: [CommonModule],
  exports: [ParamsRemoverPipe],
})
export class ParamsRemoverModule {}
