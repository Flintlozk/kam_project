import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

const MODULES = [FormsModule, ReactiveFormsModule];

@NgModule({
  declarations: [],
  imports: [],
  exports: [MODULES],
})
export class FormModule {}
