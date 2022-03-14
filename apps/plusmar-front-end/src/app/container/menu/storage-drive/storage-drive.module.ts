import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageDriveComponent } from './storage-drive.component';
import { FileSizeModule } from '@reactor-room/cms-cdk';
import { FileService } from './storage-drive.service';
@NgModule({
  declarations: [StorageDriveComponent],
  imports: [CommonModule, FileSizeModule],
  exports: [StorageDriveComponent],
  providers: [FileService],
})
export class StorageDriveModule {}
