import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IMediaButtonAction, EMediaSources, EBackground } from '@reactor-room/cms-models-lib';
import { StatusSnackbarComponent, StatusSnackbarModel, StatusSnackbarType } from '@reactor-room/itopplus-cdk';
import { IHTTPResult } from '@reactor-room/model-lib';
import { EMPTY, Observable, Subject, Subscription } from 'rxjs';
import { catchError, distinctUntilChanged, map, startWith, takeUntil, tap } from 'rxjs/operators';
import { CmsFilesService } from '../../../../services/cms-files.service';
import { autoCompleteNormalizeValue } from '../../../../services/domain/common.domain';
import { CmsMediaInfoComponent } from './cms-media-info/cms-media-info.component';
import { defaultOptions, resize, SourceImage } from '../../../../../../worker/resize/client_resize';
import { canvasEncode } from '../../../../../../worker/resize/canvas';
import { abortable, blobToText, builtinDecode, sniffMimeType } from '../../../../../../worker/resize/util';
import WorkerBridge from '../../../../../../worker/resize/worker-bridge';
import { IFile, IFileUpload } from '@reactor-room/itopplus-model-lib';
import { ConfirmDialogModel, ConfirmDialogType } from 'apps/cms-frontend/src/app/components/dialog-theme/confirm-dialog/confirm-dialog.model';
import { ConfirmDialogComponent } from 'apps/cms-frontend/src/app/components/dialog-theme/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'cms-next-cms-media-management',
  templateUrl: './cms-media-management.component.html',
  styleUrls: ['./cms-media-management.component.scss'],
})
export class CmsMediaManagementComponent implements OnInit, OnDestroy {
  isListView = false;
  @Input() isSingleAction = false;
  @Input() containerStyle = { height: 'calc(100% - 300px)' };
  isSelectedMediaList = false;
  mediaButtonActionOnSite: IMediaButtonAction[] = [
    {
      title: 'Your Upload',
      action: EMediaSources.UPLOAD,
      status: true,
    },
    {
      title: 'Deleted',
      action: EMediaSources.DELETED,
      status: false,
    },
  ];
  mediaButtonActionOffSite: IMediaButtonAction[] = [
    {
      title: 'FreePik',
      action: EMediaSources.FREEPIK,
      status: false,
    },
    {
      title: 'ShutterStock',
      action: EMediaSources.SHUTTERSTOCK,
      status: false,
    },
    {
      title: 'Unsplash',
      action: EMediaSources.UNSPLASH,
      status: false,
    },
  ];
  EFileType = EBackground;
  EMediaSources = EMediaSources;
  mediaList: IFile[] = [];
  mediaList$: Observable<IFile[]>;
  mediaListSubscription$: Subscription;
  searchMediaInput: FormControl;
  destroy$ = new Subject();
  currentMediaSource = EMediaSources.UPLOAD;
  isNoMoreData = false;
  @Output() selectedMediaListEvent = new EventEmitter<IFile[]>();
  @Output() selectedMediaEvent = new EventEmitter<IFile>();
  @Output() currentMediaSourceEvent = new EventEmitter<EMediaSources>();

  constructor(private dialog: MatDialog, private cmsFilesService: CmsFilesService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.isSelectedMediaList = this.getSelectedMediaList().length ? true : false;
    this.searchMediaInput = new FormControl();
    this.getSelectedMediaListBySource(this.currentMediaSource);
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  onInitSeachMediaFormControl(): void {
    this.mediaList$ = this.searchMediaInput.valueChanges.pipe(
      startWith(''),
      distinctUntilChanged(),
      map((value) => this.onFilterMediaList(value, this.mediaList)),
    ) as Observable<IFile[]>;
  }

  onFilterMediaList(searchKey: string, mediaList: IFile[]): IFile[] {
    const filterValue = autoCompleteNormalizeValue(searchKey);
    return mediaList.filter((item) => {
      const name = autoCompleteNormalizeValue(item?.name);
      if (name) {
        return name.includes(filterValue);
      }
    });
  }

  @HostListener('scroll', ['$event'])
  onElementScroll($event: Event): void {
    const scrollElement = $event.target as HTMLElement;
    const scrollTop = scrollElement.scrollTop;
    const endPoint = scrollElement.scrollHeight - scrollElement.clientHeight;
    if (scrollTop >= endPoint) {
      if (this.currentMediaSource === EMediaSources.UPLOAD && !this.isNoMoreData) {
        this.onGetFiles();
      }
      if (this.currentMediaSource === EMediaSources.DELETED && !this.isNoMoreData) {
        this.onGetDeletedFiles();
      }
    }
  }

  onToggleListView(): void {
    this.isListView = !this.isListView;
  }

  async onUploadNewMedia(event: HTMLInputElement) {
    try {
      if (event.files && event.files[0]) {
        const fileList = event.files;
        const files: IFileUpload[] = [];

        for (let index = 0; index < fileList.length; index++) {
          let file = fileList.item(index);
          let newFile: File;
          if (file.type.startsWith('image/')) {
            const controller = new AbortController();
            const signal = controller.signal;
            if (file.type.startsWith('image/svg+xml')) {
              const text = await abortable(signal, blobToText(file));
              const workerBridge = new WorkerBridge();
              const { data } = await abortable(
                signal,
                workerBridge.svgo(signal, text, {
                  multipass: true,
                  floatPrecision: 3,
                  plugins: {
                    removeDoctype: true,
                    removeXMLProcInst: true,
                    removeComments: true,
                    removeMetadata: true,
                    removeXMLNS: false,
                    removeEditorsNSData: true,
                    cleanupAttrs: true,
                    mergeStyles: true,
                    inlineStyles: true,
                    minifyStyles: true,
                    convertStyleToAttrs: false,
                    cleanupIDs: true,
                    removeRasterImages: false,
                    removeUselessDefs: true,
                    cleanupNumericValues: true,
                    cleanupListOfValues: false,
                    convertColors: true,
                    removeUnknownsAndDefaults: true,
                    removeNonInheritableGroupAttrs: true,
                    removeUselessStrokeAndFill: true,
                    removeViewBox: true,
                    cleanupEnableBackground: true,
                    removeHiddenElems: true,
                    removeEmptyText: true,
                    convertShapeToPath: true,
                    moveElemsAttrsToGroup: true,
                    moveGroupAttrsToElems: true,
                    collapseGroups: true,
                    convertPathData: true,
                    convertEllipseToCircle: true,
                    convertTransform: true,
                    removeEmptyAttrs: true,
                    removeEmptyContainers: true,
                    mergePaths: true,
                    removeUnusedNS: true,
                    reusePaths: false,
                    sortAttrs: false,
                    sortDefsChildren: true,
                    removeTitle: true,
                    removeDesc: true,
                    removeDimensions: false,
                    removeStyleElement: false,
                    removeScriptElement: false,
                  },
                }),
              );
              newFile = new File([data], file.name, { type: 'image/svg+xml' });
            } else {
              const mimeType = await abortable(signal, sniffMimeType(file));
              const decoded: ImageData = await builtinDecode(
                signal,
                file,
                // Either worker is good enough here.
                mimeType,
              );
              const MAX_PIXEL = 2000;
              const THRESHOLD = 3800;
              let { width, height } = decoded;
              if (width > THRESHOLD || height > THRESHOLD) {
                if (width > height) {
                  const aspect = height / width;
                  height = Math.round(MAX_PIXEL * aspect);
                  width = MAX_PIXEL;
                } else {
                  const aspect = width / height;
                  width = Math.round(MAX_PIXEL * aspect);
                  height = MAX_PIXEL;
                }
                const options = defaultOptions;
                options.width = width;
                options.height = height;
                const source: SourceImage = {
                  decoded,
                  file: file,
                };
                const result = await resize(signal, source, options);
                const blob = await canvasEncode(result, file.type, 1);
                newFile = new File([blob], file.name, { type: file.type });
              }
            }
            if (newFile && newFile.size < file.size) {
              file = newFile;
            }
            // TODO: For Download Debug Only
            // const url = URL.createObjectURL(file);
            // const a = document.createElement('a');
            // document.body.appendChild(a);
            // a.href = url;
            // a.download = file.name;
            // a.click();
            // window.URL.revokeObjectURL(url);
          }
          const fileUpload: IFileUpload = {
            file,
            name: file.name,
            tags: [],
            description: '',
          };
          files.push(fileUpload);
        }
        if (fileList.length === 1) {
          const dialogRef = this.dialog.open(CmsMediaInfoComponent, {
            height: 'auto',
            data: files[0],
          });
          dialogRef
            .afterClosed()
            .pipe(takeUntil(this.destroy$))
            .subscribe((data: IFileUpload) => {
              if (data) {
                if (!data.name) data.name = data.file.name;
                files[0] = data;
                this.onUploadFiles(files);
              }
            });
        } else {
          this.onUploadFiles(files);
        }
        event.value = '';
      }
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      console.error(err);
      throw err;
    }
  }

  onUploadFiles(files: IFileUpload[]): void {
    this.cmsFilesService
      .uploadFiles(files)
      .pipe(
        takeUntil(this.destroy$),
        tap((result: IHTTPResult) => {
          if (result.status === 200) {
            this.snackBar.openFromComponent(StatusSnackbarComponent, {
              data: {
                type: StatusSnackbarType.SUCCESS,
                message: 'Uploaded Successfully',
              } as StatusSnackbarModel,
            });
            if (this.currentMediaSource === EMediaSources.UPLOAD) {
              this.onGetFiles();
            }
          } else {
            this.snackBar.openFromComponent(StatusSnackbarComponent, {
              data: {
                type: StatusSnackbarType.ERROR,
                message: 'Upload Failed',
              } as StatusSnackbarModel,
            });
          }
        }),
        catchError((e) => {
          console.log('e  => onUploadFiles :>> ', e);
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

  onSelectedMediaList(index: number): void {
    this.mediaList[index].status = !this.mediaList[index].status;
    this.isSelectedMediaList = this.getSelectedMediaList().length ? true : false;
    const selectedMediaList = this.mediaList.filter((item) => item.status === true);
    this.selectedMediaListEvent.emit(selectedMediaList);
  }

  onSelectedMediaListItem(index: number): void {
    this.mediaList.forEach((media) => (media.status = false));
    this.mediaList[index].status = true;
    this.isSelectedMediaList = true;
    this.selectedMediaEvent.emit(this.mediaList[index]);
  }

  onEditFile(index: number): void {
    this.mediaList[index].isDeleted = true;
  }

  onTrashFiles(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        type: ConfirmDialogType.DANGER,
        title: 'Delete Confirmation',
        content: 'Are you sure to delete these media?',
      } as ConfirmDialogModel,
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.isSelectedMediaList = false;
        const selectedMediaList = this.getSelectedMediaList();
        if (selectedMediaList) {
          const filePaths: string[] = [];
          selectedMediaList.forEach((file) => {
            filePaths.push(file.path);
          });

          this.cmsFilesService
            .trashFiles(filePaths)
            .pipe(
              takeUntil(this.destroy$),
              tap((result: IHTTPResult) => {
                if (result.status === 200) {
                  this.snackBar.openFromComponent(StatusSnackbarComponent, {
                    data: {
                      type: StatusSnackbarType.SUCCESS,
                      message: 'Files Moved To Delete Folder Successfully',
                    } as StatusSnackbarModel,
                  });

                  selectedMediaList.forEach((seletecMedia) => {
                    const index = this.mediaList.indexOf(seletecMedia);
                    this.mediaList.splice(index, 1);
                  });
                  if (this.currentMediaSource === EMediaSources.UPLOAD) {
                    this.onGetFiles();
                  }
                } else {
                  this.snackBar.openFromComponent(StatusSnackbarComponent, {
                    data: {
                      type: StatusSnackbarType.ERROR,
                      message: 'Deleted Failed',
                    } as StatusSnackbarModel,
                  });
                }
              }),
              catchError((e) => {
                console.log('e  => onTrashFiles :>> ', e);
                this.showUnexpectedError();
                return EMPTY;
              }),
            )
            .subscribe();
        }
      }
    });
  }

  onRecoverFiles(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        type: ConfirmDialogType.ACTION,
        title: 'Recovery Confirmation',
        content: 'Are you sure to recover these media?',
      } as ConfirmDialogModel,
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.isSelectedMediaList = false;
        const selectedMediaList = this.getSelectedMediaList();
        if (selectedMediaList) {
          const filePaths: string[] = [];
          selectedMediaList.forEach((file) => {
            filePaths.push(file.path);
          });

          this.cmsFilesService
            .recoverFiles(filePaths)
            .pipe(
              takeUntil(this.destroy$),
              tap((result: IHTTPResult) => {
                if (result.status === 200) {
                  this.snackBar.openFromComponent(StatusSnackbarComponent, {
                    data: {
                      type: StatusSnackbarType.SUCCESS,
                      message: 'Files Recovered From Delete Folder Successfully',
                    } as StatusSnackbarModel,
                  });
                  selectedMediaList.forEach((seletecMedia) => {
                    const index = this.mediaList.indexOf(seletecMedia);
                    this.mediaList.splice(index, 1);
                  });
                  if (this.currentMediaSource === EMediaSources.DELETED) {
                    this.onGetDeletedFiles();
                  }
                } else {
                  this.snackBar.openFromComponent(StatusSnackbarComponent, {
                    data: {
                      type: StatusSnackbarType.ERROR,
                      message: 'Recover Failed',
                    } as StatusSnackbarModel,
                  });
                }
              }),
              catchError((e) => {
                console.log('e  => onRecoverFiles :>> ', e);
                this.showUnexpectedError();
                return EMPTY;
              }),
            )
            .subscribe();
        }
      }
    });
  }

  onDeleteFiles(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        type: ConfirmDialogType.DANGER,
        title: 'Delete Confirmation',
        content: 'Are you sure to delete these media pernamently? This action cannot be recovered',
      } as ConfirmDialogModel,
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.isSelectedMediaList = false;
        const selectedMediaList = this.getSelectedMediaList();
        if (selectedMediaList) {
          const filePaths: string[] = [];
          selectedMediaList.forEach((file) => {
            filePaths.push(file.path);
          });

          this.cmsFilesService
            .deleteFiles(filePaths)
            .pipe(
              takeUntil(this.destroy$),
              tap((result: IHTTPResult) => {
                if (result.status === 200) {
                  this.snackBar.openFromComponent(StatusSnackbarComponent, {
                    data: {
                      type: StatusSnackbarType.SUCCESS,
                      message: 'Files Deleted From Delete Folder Successfully',
                    } as StatusSnackbarModel,
                  });
                  selectedMediaList.forEach((seletecMedia) => {
                    const index = this.mediaList.indexOf(seletecMedia);
                    this.mediaList.splice(index, 1);
                  });
                  if (this.currentMediaSource === EMediaSources.DELETED) {
                    this.onGetDeletedFiles();
                  }
                } else {
                  this.snackBar.openFromComponent(StatusSnackbarComponent, {
                    data: {
                      type: StatusSnackbarType.ERROR,
                      message: 'Deleted Failed',
                    } as StatusSnackbarModel,
                  });
                }
              }),
              catchError((e) => {
                console.log('e  => onDeleteFiles :>> ', e);
                this.showUnexpectedError();
                return EMPTY;
              }),
            )
            .subscribe();
        }
      }
    });
  }

  onEmptyFiles(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        type: ConfirmDialogType.DANGER,
        title: 'Empty Confirmation',
        content: 'Are you sure to empty this folder?',
      } as ConfirmDialogModel,
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.cmsFilesService
          .emptyFiles()
          .pipe(
            takeUntil(this.destroy$),
            tap((result: IHTTPResult) => {
              if (result.status === 200) {
                this.snackBar.openFromComponent(StatusSnackbarComponent, {
                  data: {
                    type: StatusSnackbarType.SUCCESS,
                    message: 'Delete Folder Is Empty',
                  } as StatusSnackbarModel,
                });
                if (this.currentMediaSource === EMediaSources.DELETED) {
                  this.mediaList = [];
                  this.selectedMediaListEvent.emit([]);
                  this.selectedMediaEvent.emit(null);
                  this.onGetDeletedFiles();
                }
              } else {
                this.snackBar.openFromComponent(StatusSnackbarComponent, {
                  data: {
                    type: StatusSnackbarType.ERROR,
                    message: 'Failed Tasks',
                  } as StatusSnackbarModel,
                });
              }
            }),
            catchError((e) => {
              console.log('e  => onEmptyFiles :>> ', e);
              this.showUnexpectedError();
              return EMPTY;
            }),
          )
          .subscribe();
      }
    });
  }

  onMediaButtonAction(index: number, key: string): void {
    this.mediaButtonActionOffSite.forEach((button) => (button.status = false));
    this.mediaButtonActionOnSite.forEach((button) => (button.status = false));
    switch (key) {
      case 'onsite':
        this.mediaButtonActionOnSite[index].status = true;
        this.getSelectedMediaListBySource(this.mediaButtonActionOnSite[index].action);
        break;
      case 'offsite':
        this.mediaButtonActionOffSite[index].status = true;
        break;
      default:
        break;
    }
  }

  getSelectedMediaListBySource(source: EMediaSources): void {
    this.mediaList.forEach((media) => (media.status = false));
    this.currentMediaSource = source;
    this.mediaList = [];
    this.currentMediaSourceEvent.emit(source);
    this.selectedMediaListEvent.emit([]);
    this.selectedMediaEvent.emit(null);
    this.isNoMoreData = false;
    switch (source) {
      case EMediaSources.UPLOAD:
        this.onGetFiles();
        break;
      case EMediaSources.DELETED:
        this.onGetDeletedFiles();
        break;
      default:
        break;
    }
  }

  onGetFiles(): void {
    this.cmsFilesService
      .getFiles(this.mediaList.length, 20)
      .pipe(
        takeUntil(this.destroy$),
        tap((list) => {
          this.onInitSeachMediaFormControl();
          if (list?.length && list) {
            this.mediaList.push(...list);
          } else {
            this.isNoMoreData = true;
          }
        }),
        catchError((e) => {
          console.log('e  => onGetFiles :>> ', e);
          this.showUnexpectedError();
          return EMPTY;
        }),
      )
      .subscribe();
  }

  onGetDeletedFiles(): void {
    this.cmsFilesService
      .getDeletedFiles(this.mediaList.length, 20)
      .pipe(
        takeUntil(this.destroy$),
        tap((list) => {
          this.onInitSeachMediaFormControl();
          if (list?.length && list) {
            this.mediaList.push(...list);
          } else {
            this.isNoMoreData = true;
          }
        }),
        catchError((e) => {
          console.log('e  => onGetDeletedFiles :>> ', e);
          this.showUnexpectedError();
          return EMPTY;
        }),
      )
      .subscribe();
  }

  getSelectedMediaList(): IFile[] {
    const selectedMediaList = this.mediaList.filter((media) => media.status === true);
    return selectedMediaList;
  }

  trackByIndex(index: number): number {
    return index;
  }
}
