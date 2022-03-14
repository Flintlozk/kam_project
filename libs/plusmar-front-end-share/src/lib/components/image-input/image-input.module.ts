import { MatTooltipModule } from '@angular/material/tooltip';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageInputComponent } from './image-input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatInputModule } from '@angular/material/input';
@NgModule({
  declarations: [ImageInputComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, TranslateModule, MatInputModule, MatTooltipModule],
  exports: [ImageInputComponent],
})
export class ImageInputModule {}
