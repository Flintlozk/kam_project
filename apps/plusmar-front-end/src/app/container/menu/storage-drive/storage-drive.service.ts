import { Apollo } from 'apollo-angular';
import { Injectable, OnDestroy } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { IFile, IFilesInfo, IFileUpload, ISystemFilesInfo } from '@reactor-room/itopplus-model-lib';
import {
  DELETE_FILES,
  EMPTY_FILES,
  GET_DELETED_FILES,
  GET_FILES,
  GET_FILES_INFO,
  GET_SYSTEM_FILES_INFO,
  RECOVER_FILES,
  TRASH_FILES,
  UPLOAD_FILES,
} from 'apps/cms-frontend/src/app/modules/cms/services/cms-query/files.query';
import { IHTTPResult } from '@reactor-room/model-lib';
@Injectable()
export class FileService implements OnDestroy {
  constructor(private apollo: Apollo) {}
  destroy$: Subject<boolean> = new Subject<boolean>();

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  getFilesInfo(): Observable<IFilesInfo> {
    return this.apollo
      .query({
        query: GET_FILES_INFO,
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getFilesInfo']),
      );
  }
  uploadFiles(files: IFileUpload[]): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: UPLOAD_FILES,
        fetchPolicy: 'no-cache',
        variables: { files },
        context: {
          useMultipart: true,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['uploadFiles']),
      );
  }

  trashFiles(filePaths: string[]): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: TRASH_FILES,
        fetchPolicy: 'no-cache',
        variables: { filePaths },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['trashFiles']),
      );
  }

  recoverFiles(filePaths: string[]): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: RECOVER_FILES,
        fetchPolicy: 'no-cache',
        variables: { filePaths },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['recoverFiles']),
      );
  }

  deleteFiles(filePaths: string[]): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: DELETE_FILES,
        fetchPolicy: 'no-cache',
        variables: { filePaths },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['deleteFiles']),
      );
  }

  emptyFiles(): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: EMPTY_FILES,
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['emptyFiles']),
      );
  }

  getSystemFilesInfo(): Observable<ISystemFilesInfo> {
    return this.apollo
      .query({
        query: GET_SYSTEM_FILES_INFO,
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getSystemFilesInfo']),
      );
  }

  getFiles(skip: number, limit: number): Observable<IFile[]> {
    return this.apollo
      .query({
        query: GET_FILES,
        fetchPolicy: 'no-cache',
        variables: { skip, limit },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getFiles']),
      );
  }

  getDeletedFiles(skip: number, limit: number): Observable<IFile[]> {
    return this.apollo
      .query({
        query: GET_DELETED_FILES,
        fetchPolicy: 'no-cache',
        variables: { skip, limit },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getDeletedFiles']),
      );
  }
}
