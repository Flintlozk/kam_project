import { Injectable, OnDestroy } from '@angular/core';
import { IFile, IFilesInfo, IFileUpload, ISystemFilesInfo } from '@reactor-room/itopplus-model-lib';
import { IHTTPResult } from '@reactor-room/model-lib';
import { Apollo } from 'apollo-angular';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { TRASH_FILES, GET_DELETED_FILES, GET_FILES, UPLOAD_FILES, RECOVER_FILES, DELETE_FILES, EMPTY_FILES, GET_FILES_INFO, GET_SYSTEM_FILES_INFO } from './cms-query/files.query';

@Injectable({
  providedIn: 'root',
})
export class CmsFilesService implements OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private apollo: Apollo) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
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
