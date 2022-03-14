import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageDriveComponent } from './storage-drive.component';
import { FileSizeModule } from '@reactor-room/cms-cdk';

@NgModule({
  declarations: [StorageDriveComponent],
  imports: [CommonModule, FileSizeModule],
  exports: [StorageDriveComponent],
})
export class StorageDriveModule {}
