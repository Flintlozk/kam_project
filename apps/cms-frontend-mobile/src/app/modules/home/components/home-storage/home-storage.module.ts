import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeStorageComponent } from './home-storage.component';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [HomeStorageComponent],
  imports: [CommonModule, TranslateModule],
  exports: [HomeStorageComponent],
})
export class HomeStorageModule {}
