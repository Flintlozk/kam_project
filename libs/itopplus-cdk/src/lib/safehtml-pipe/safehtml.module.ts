import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeHtmlPipe } from './safehtml.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [SafeHtmlPipe],
  exports: [SafeHtmlPipe],
})
export class SafeHtmlPipeModule {}
