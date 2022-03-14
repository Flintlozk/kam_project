import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StatusSnackbarComponent, StatusSnackbarModel, StatusSnackbarType } from '@reactor-room/itopplus-cdk';
import { IFilesInfo, ISystemFilesInfo } from '@reactor-room/itopplus-model-lib';
import { EMPTY, Subject, zip } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { CmsFilesService } from '../../modules/cms/services/cms-files.service';
import { IStorage } from './storage-drive.model';

@Component({
  selector: 'cms-next-storage-drive',
  templateUrl: './storage-drive.component.html',
  styleUrls: ['./storage-drive.component.scss'],
})
export class StorageDriveComponent implements OnInit, OnDestroy {
  storageUsage: IStorage[] = [
    {
      name: 'Images',
      usedByte: 0,
      colorCode: '#2FC639',
    },
    {
      name: 'Videos',
      usedByte: 0,
      colorCode: '#9B0000',
    },
    {
      name: 'Others',
      usedByte: 0,
      colorCode: '#E3E5EB',
    },
  ];
  storageSystemUsage = [
    {
      name: 'Message',
      usedByte: 0,
      colorCode: '#dede07',
    },
    {
      name: 'Product/Order',
      usedByte: 0,
      colorCode: '#0202cc',
    },
    {
      name: 'Others2',
      usedByte: 0,
      colorCode: '#b8babf',
    },
  ];

  AllStorage: IStorage[];
  totalByte = 3 * Math.pow(1024, 3);
  totalUsedByte: number;
  destroy$ = new Subject();

  constructor(private cmsFileService: CmsFilesService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.totalUsedByte = this.getTotalUsedMB();
    this.onGetFilesInfo();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
  onGetFilesInfo() {
    const fileInfo$ = this.cmsFileService.getFilesInfo();
    const systemFileInfo$ = this.cmsFileService.getSystemFilesInfo();
    zip(fileInfo$, systemFileInfo$)
      .pipe(
        takeUntil(this.destroy$),
        tap((result) => {
          const [info, systemInfo] = result;
          if (info) {
            this.patchValueFileInfo(info);
          }
          if (systemInfo) {
            this.patchValueSystemFileInfo(systemInfo);
          }
          this.AllStorage = this.storageUsage.concat(this.storageSystemUsage);
        }),
        catchError((e) => {
          console.log('e  => onGetFilesInfo :>> ', e);
          this.showUnexpectedError();
          return EMPTY;
        }),
      )
      .subscribe();
  }

  showUnexpectedError(): void {
    this.snackBar.openFromComponent(StatusSnackbarComponent, {
      data: {
        type: StatusSnackbarType.ERROR,
        message: 'Unexpected Error occured...Try again later!',
      } as StatusSnackbarModel,
    });
  }
  patchValueFileInfo(info: IFilesInfo) {
    if (info) {
      this.storageUsage[0].usedByte = parseInt(info.imageSize);
      this.storageUsage[1].usedByte = parseInt(info.videoSize);
      this.storageUsage[2].usedByte = parseInt(info.totalSize) - (parseInt(info.imageSize) + parseInt(info.videoSize));
      this.totalUsedByte = parseInt(info.totalSize);
    } else {
      this.snackBar.openFromComponent(StatusSnackbarComponent, {
        data: {
          type: StatusSnackbarType.ERROR,
          message: 'Cannot get files info',
        } as StatusSnackbarModel,
      });
    }
  }
  patchValueSystemFileInfo(info: ISystemFilesInfo) {
    if (info) {
      this.storageSystemUsage[0].usedByte = parseInt(info.messageSize);
      this.storageSystemUsage[1].usedByte = parseInt(info.productSize);
      this.storageSystemUsage[2].usedByte = parseInt(info.totalSize) - (parseInt(info.messageSize) + parseInt(info.productSize));

      this.totalUsedByte += parseInt(info.totalSize);
    } else {
      this.snackBar.openFromComponent(StatusSnackbarComponent, {
        data: {
          type: StatusSnackbarType.ERROR,
          message: 'Cannot get Sys temfiles info',
        } as StatusSnackbarModel,
      });
    }
  }

  getTotalUsedMB(): number {
    return this.storageUsage.map((storage) => storage.usedByte).reduce((a, b) => a + b);
  }

  trackByIndex(index: number): number {
    return index;
  }
}
