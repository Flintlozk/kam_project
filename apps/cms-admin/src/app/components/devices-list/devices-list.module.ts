import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevicesListComponent } from './devices-list.component';

@NgModule({
  declarations: [DevicesListComponent],
  imports: [CommonModule],
  exports: [DevicesListComponent],
})
export class DevicesListModule {}
