import { NgModule } from '@angular/core';
import { ContentContentEditComponent } from './content-content-edit.component';
import { ContentContentRenderingModule } from '../content-content-rendering/content-content-rendering.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [ContentContentEditComponent],
  imports: [CommonModule, ContentContentRenderingModule, MatFormFieldModule, MatInputModule, RouterModule, TranslateModule],
  exports: [ContentContentEditComponent],
})
export class ContentContentEditModule {}
