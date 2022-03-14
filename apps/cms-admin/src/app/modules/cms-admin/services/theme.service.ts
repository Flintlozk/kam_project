import { Injectable, OnDestroy } from '@angular/core';
import { FormArray } from '@angular/forms';
import { IID, IThemeAssets, IThemeRendering, IThemeRenderingHtml, IUpdateThumnail } from '@reactor-room/cms-models-lib';
import { IGQLFileSteam, IHTTPResult } from '@reactor-room/model-lib';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ThemeService implements OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  private isPreviewMode = new BehaviorSubject<boolean>(false);
  getIsPreviewMode = this.isPreviewMode.asObservable();
  private devices = new BehaviorSubject<FormArray>(null);
  getDevices = this.devices.asObservable();
  selectedIndex = new BehaviorSubject<number>(0);
  getSelectedIndex = this.selectedIndex.asObservable();
  urlIframe = new BehaviorSubject<string>('');
  getUrlIframe = this.urlIframe.asObservable();
  themeRendering = new Subject<IThemeRendering>();
  updatedTheme = new BehaviorSubject<IThemeRendering>(null);
  editorOptionsSubject = new Subject<string>();
  thumbnailUrl = new Subject<string>();
  htmlIndex = new Subject<number>();
  htmlFiles = new BehaviorSubject<IThemeRenderingHtml[]>(null);

  constructor(private apollo: Apollo) {}
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
  updateIsPreviewMode(status: boolean): void {
    this.isPreviewMode.next(status);
  }
  updateDevices(devices: FormArray): void {
    this.devices.next(devices);
  }
  updateSelectedIndex(selectedIndex: number): void {
    this.selectedIndex.next(selectedIndex);
  }
  updateUrlIFrame(url: string): void {
    this.urlIframe.next(url);
  }
  createTheme(themeModel: IThemeRendering): Observable<boolean> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation createTheme($themeModel: ThemeModelInput) {
            createTheme(themeModel: $themeModel)
          }
        `,
        variables: {
          themeModel: themeModel,
        },
        context: {
          useMultipart: true,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['createTheme']),
      );
  }
  updateTheme(): Observable<IHTTPResult> {
    const themeModel = this.updatedTheme.getValue();
    if (themeModel !== null) {
      return this.apollo
        .mutate({
          mutation: gql`
            mutation updateTheme($themeModel: ThemeModelInput) {
              updateTheme(themeModel: $themeModel) {
                status
                value
              }
            }
          `,
          variables: {
            themeModel: themeModel,
          },
          context: {
            useMultipart: true,
          },
          fetchPolicy: 'no-cache',
        })
        .pipe(
          takeUntil(this.destroy$),
          map((x) => x.data['updateTheme']),
        );
    }
  }
  deleteTheme(_id: string): Observable<boolean> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation deleteTheme($_id: String) {
            deleteTheme(_id: $_id)
          }
        `,
        variables: {
          _id: _id,
        },
        context: {
          useMultipart: true,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['deleteTheme']),
      );
  }
  getThemeByThemeId(_id: string): Observable<IThemeRendering> {
    const query = this.apollo.watchQuery({
      query: gql`
        query getThemeByThemeId($_id: String) {
          getThemeByThemeId(_id: $_id) {
            _id
            name
            menu
            devices {
              minwidth
              icon
              baseFontSize
              default
            }
            settings {
              font {
                type
                familyCode
                size
                unit
                style
                lineHeight
                letterSpacing
              }
              color {
                type
                dark {
                  color
                  bgColor
                  opacity
                  bgOpacity
                }
                light {
                  color
                  bgColor
                  opacity
                  bgOpacity
                }
              }
              integration {
                googleFont
                fontAwesome
              }
              defaultFontFamily
            }
            html {
              name
              html
              thumbnail {
                path
              }
            }
            image {
              _id
              type
              url
              name
            }
            javascript {
              _id
              type
              url
              name
              plaintext
            }
            style {
              _id
              type
              url
              name
              plaintext
            }
          }
        }
      `,
      variables: {
        _id: _id,
      },
      context: {
        useMultipart: true,
      },
      fetchPolicy: 'no-cache',
    });
    const returnValues = query.valueChanges;
    return returnValues.pipe(
      takeUntil(this.destroy$),
      map((x) => x.data['getThemeByThemeId']),
    );
  }
  getHtmlByThemeId(IDFile: IID): Observable<IHTTPResult> {
    const query = this.apollo.watchQuery({
      query: gql`
        query getHtmlByThemeId($IDFile: IDFile) {
          getHtmlByThemeId(IDFile: $IDFile) {
            status
            value {
              name
              html
              thumbnail {
                path
              }
            }
          }
        }
      `,
      variables: {
        IDFile: IDFile,
      },
      fetchPolicy: 'no-cache',
    });
    const returnValues = query.valueChanges;
    return returnValues.pipe(
      takeUntil(this.destroy$),
      map((x) => x.data['getHtmlByThemeId']),
    );
  }
  getCssByThemeId(IDFile: IID): Observable<IHTTPResult> {
    const query = this.apollo.watchQuery({
      query: gql`
        query getCssByThemeId($IDFile: IDFile) {
          getCssByThemeId(IDFile: $IDFile) {
            status
            value
          }
        }
      `,
      variables: {
        IDFile: IDFile,
      },
      fetchPolicy: 'no-cache',
    });
    const returnValues = query.valueChanges;
    return returnValues.pipe(
      takeUntil(this.destroy$),
      map((x) => x.data['getCssByThemeId']),
    );
  }
  getJavascriptByThemeId(IDFile: IID): Observable<IHTTPResult> {
    const query = this.apollo.watchQuery({
      query: gql`
        query getJavascriptByThemeId($IDFile: IDFile) {
          getJavascriptByThemeId(IDFile: $IDFile) {
            status
            value
          }
        }
      `,
      variables: {
        IDFile: IDFile,
      },
      fetchPolicy: 'no-cache',
    });
    const returnValues = query.valueChanges;
    return returnValues.pipe(
      takeUntil(this.destroy$),
      map((x) => x.data['getJavascriptByThemeId']),
    );
  }
  uploadFileToCMSFileServer(file: IThemeAssets): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation uploadFileToCMSFileServer($file: fileInput) {
            uploadFileToCMSFileServer(file: $file) {
              status
              value
            }
          }
        `,
        variables: {
          file: file,
        },
        context: {
          useMultipart: true,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['uploadFileToCMSFileServer']),
      );
  }
  updateFileToCMSFileServer(file: IThemeAssets): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation updateFileToCMSFileServer($file: UpdatefileInput) {
            updateFileToCMSFileServer(file: $file) {
              status
              value
            }
          }
        `,
        variables: {
          file: file,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updateFileToCMSFileServer']),
      );
  }
  updateThumnailByIndex(updateThumnail: IUpdateThumnail): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation updateThumnailByIndex($updateThumnail: updateThumnail) {
            updateThumnailByIndex(updateThumnail: $updateThumnail) {
              status
              value
            }
          }
        `,
        variables: {
          updateThumnail: updateThumnail,
        },
        context: {
          useMultipart: true,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updateThumnailByIndex']),
      );
  }

  updateThumnail(stream: IGQLFileSteam): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation updateThumnail($stream: Upload) {
            updateThumnail(stream: $stream) {
              status
              value
            }
          }
        `,
        variables: {
          stream: stream,
        },
        context: {
          useMultipart: true,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updateThumnail']),
      );
  }
  createThemeLayoutHtmlFile(_id: string): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation createThemeLayoutHtmlFile($_id: String) {
            createThemeLayoutHtmlFile(_id: $_id) {
              status
              value
            }
          }
        `,
        variables: {
          _id: _id,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['createThemeLayoutHtmlFile']),
      );
  }
}
