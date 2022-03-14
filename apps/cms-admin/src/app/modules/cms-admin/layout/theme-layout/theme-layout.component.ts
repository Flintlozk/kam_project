import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { EmumThemeResourceType, EnumActionThemeMode, EnumThemeAssertType, EnumThemeHtmlType, IThemeAssets, IThemeRendering, UserActionEnum } from '@reactor-room/cms-models-lib';
import { environmentLib } from '@reactor-room/environment-services-frontend';
import { ConfirmDialogComponent, ConfirmDialogModel, ConfirmDialogType } from '@reactor-room/itopplus-cdk';
import { IHTTPResult } from '@reactor-room/model-lib';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SaveFileModalComponent } from '../../component/save-file-modal/save-file-modal.component';
import { UpdateHtmlErrorModalComponent } from '../../component/update-html-error-modal/update-html-error-modal.component';
import { ThemeService } from '../../services/theme.service';
declare const monaco;
@Component({
  selector: 'reactor-room-theme-layout',
  templateUrl: './theme-layout.component.html',
  styleUrls: ['./theme-layout.component.scss'],
})
export class ThemeLayoutComponent implements OnInit {
  @ViewChild('monacoContainer') monacoContainer: ElementRef;
  srcImage: string = null;
  beforeIndex: number;
  beforeCode: string;
  typeOfFile: string;
  _id: string;
  destroy$: Subject<boolean> = new Subject();
  monacoFormGroup = this.form.group({
    code: '',
  });
  ismonaco = false;
  fileSrc: string | ArrayBuffer;
  themeRendering: IThemeRendering;
  moreImage = false;
  moreJavascript = false;
  moreStyle = false;
  moreHtml = false;
  editorOptions: any;
  editor: any;
  topic: string;
  isPreviewMode: boolean;
  selectedIndex: number;
  urlIframe: string;
  imageFile: IThemeAssets;
  name: string;
  htmlIndex: number;
  minWidth: string;
  constructor(private form: FormBuilder, private themeService: ThemeService, private router: Router, private activeRoute: ActivatedRoute, public dialog: MatDialog) {
    this.themeService.getIsPreviewMode.pipe(takeUntil(this.destroy$)).subscribe((status) => {
      this.isPreviewMode = status;
    });
    this.themeService.getSelectedIndex.pipe(takeUntil(this.destroy$)).subscribe((index) => {
      this.selectedIndex = index;
    });
    this.activeRoute.params.subscribe(({ _id }) => {
      this._id = _id;
      // this.themeService.updateUrlIFrame(`${environmentLib.cms.backendUrl}/themes/${this._id}/0`);
    });
    this.themeService.urlIframe.pipe(takeUntil(this.destroy$)).subscribe((url) => {
      this.urlIframe = url;
    });
  }

  onInit(editor) {
    this.editor = editor;
  }
  ngOnInit(): void {
    this.themeService.getThemeByThemeId(this._id).subscribe(
      (templateData) => {
        this.themeRendering = new Object() as IThemeRendering;
        this.themeRendering = templateData;
        const htmlContent = this.themeRendering.html[0].html;
        this.monacoFormGroup.patchValue({
          code: htmlContent,
        });
        this.beforeCode = JSON.stringify(htmlContent);
        this.beforeIndex = 0;
        this.topic = 'Index.html';
        this.themeService.editorOptionsSubject.subscribe((typeOfFile) => {
          this.typeOfFile = typeOfFile;
          this.editorOptions = { theme: 'vs-light', language: typeOfFile, fontSize: '16px' };
        });
        this.themeService.editorOptionsSubject.next('html');
        if (!this.themeRendering.javascript) {
          this.themeRendering.javascript = [];
        }
        if (!this.themeRendering.style) {
          this.themeRendering.style = [];
        }
        if (!this.themeRendering.image) {
          this.themeRendering.image = [];
        }
        this.themeService.themeRendering.next(this.themeRendering);
        this.themeService.thumbnailUrl.next(this.themeRendering.html[0]?.thumbnail?.path);
        this.themeService.htmlFiles.next(this.themeRendering.html);
        this.themeService.htmlIndex.next(0);
        this.htmlIndex = 0;
        this.dynamicIframeSize();
        this.themeService.updateSelectedIndex(0);
      },
      (err) => {
        this.openErrorDialog(err);
      },
    );
  }

  readURL($event): void {
    if ($event.target.files && $event.target.files[0]) {
      const file = $event.target.files[0];
      switch (file.type) {
        case 'text/javascript': {
          const cmsFile = { _id: this._id, type: EmumThemeResourceType.JS, javascript: file, name: file.name };
          this.themeService.uploadFileToCMSFileServer(cmsFile).subscribe(
            (result) => {
              if (result.status === 200) {
                this.themeRendering.javascript.push({ ...cmsFile, url: result.value });
              }
            },
            (err) => {
              this.openErrorDialog(err);
            },
          );
          break;
        }
        case 'text/css': {
          const cmsFile = { _id: this._id, type: EmumThemeResourceType.CSS, style: file, name: file.name };
          this.themeService.uploadFileToCMSFileServer(cmsFile).subscribe(
            (result) => {
              if (result.status === 200) {
                this.themeRendering.style.push({ ...cmsFile, url: result.value });
              }
            },
            (err) => {
              this.openErrorDialog(err);
            },
          );
          break;
        }
        default: {
          const cmsFile = { _id: this._id, type: EnumThemeAssertType.IMAGE, image: file, name: file.name };
          this.themeService.uploadFileToCMSFileServer(cmsFile).subscribe(
            (result) => {
              if (result.status === 200) {
                this.themeRendering.image.push({ ...cmsFile, url: result.value });
              }
            },
            (err) => {
              this.openErrorDialog(err);
            },
          );
          break;
        }
      }
    }
  }
  deleteThemeHandler(): void {
    this.themeService
      .deleteTheme(this._id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        async () => {
          await this.router.navigate(['/layout/theme']);
        },
        (err) => {
          this.openErrorDialog(err);
        },
      );
  }
  async saveThemeHandler(type: EnumActionThemeMode): Promise<void> {
    const result = await this.updateChangeFile();
    if (result.status !== 200) {
      this.dialog.open(UpdateHtmlErrorModalComponent, {
        data: result,
      });
    } else {
      this.themeService
        .updateTheme()
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          async (result) => {
            switch (type) {
              case EnumActionThemeMode.SAVE:
                await this.router.navigate(['/layout/theme']);
                break;
              case EnumActionThemeMode.PREVIEW:
                this.themeService.updateUrlIFrame(`${environmentLib.cms.backendUrl}/themes/${this._id}/0/${result.value}`);
                this.themeService.updateIsPreviewMode(true);
                break;
            }
          },
          (err) => {
            this.openErrorDialog(err);
          },
        );
    }
  }

  onClickMoreImage(): void {
    this.moreImage = !this.moreImage;
  }
  onClickMoreJavascript(): void {
    this.moreJavascript = !this.moreJavascript;
  }
  onClickMoreStyle(): void {
    this.moreStyle = !this.moreStyle;
  }
  onClickMoreHtml(): void {
    this.moreHtml = !this.moreHtml;
  }
  onClickSetImage(file: IThemeAssets): void {
    this.imageFile = file;
  }
  getClipboard(): string {
    return this.imageFile?.url ? this.imageFile.url : null;
  }
  onClickShowImage(): void {
    if (this.beforeCode !== 'image') {
      if (this.beforeCode !== JSON.stringify(this.monacoFormGroup.value.code)) {
        const isError = this.monacoContainer?.nativeElement?.querySelector('.squiggly-error');
        if (!isError) {
          const dialogRef = this.dialog.open(SaveFileModalComponent);
          dialogRef.afterClosed().subscribe(async (result) => {
            if (result === UserActionEnum.CONFIRM) {
              const httpResult = await this.updateChangeFile();
              if (httpResult.status !== 200) {
                this.dialog.open(UpdateHtmlErrorModalComponent, {
                  data: httpResult,
                });
              } else {
                this.getImageFile(this.imageFile);
              }
            }
          });
        } else {
          alert('validation fail please change the code');
        }
      } else {
        this.getImageFile(this.imageFile);
      }
    } else {
      this.getImageFile(this.imageFile);
    }
  }
  onClickAppendUrl(): void {
    const line = this.editor.getPosition();
    const text = this.imageFile.url;
    const range = new monaco.Range(line.lineNumber, line.column, line.lineNumber, line.column);
    const id = { major: 1, minor: 1 };
    const op = { id, range: range, text, forceMoveMarkers: true };
    this.editor.executeEdits('my-source', [op]);
  }
  onClickOpenHTMLFile(index: number): void {
    this.srcImage = null;
    if (this.beforeCode !== 'image') {
      if (this.beforeCode !== JSON.stringify(this.monacoFormGroup.value.code)) {
        const isError = this.monacoContainer?.nativeElement?.querySelector('.squiggly-error');
        if (!isError) {
          const dialogRef = this.dialog.open(SaveFileModalComponent);
          dialogRef.afterClosed().subscribe(async (result) => {
            if (result === UserActionEnum.CONFIRM) {
              const httpresult = await this.updateChangeFile();
              if (httpresult.status !== 200) {
                this.dialog.open(UpdateHtmlErrorModalComponent, {
                  data: httpresult,
                });
              } else {
                this.getHTMlFile(index);
              }
            }
          });
        } else {
          alert('validation fail please change the code');
        }
      } else {
        this.getHTMlFile(index);
      }
    } else {
      this.getHTMlFile(index);
    }
  }
  onClickOpenCSSFile(index: number): void {
    this.srcImage = null;
    if (this.themeRendering.style[index].name !== 'site.css') {
      if (this.beforeCode !== 'image') {
        if (this.beforeCode !== JSON.stringify(this.monacoFormGroup.value.code)) {
          const isError = this.monacoContainer?.nativeElement?.querySelector('.squiggly-error');
          if (!isError) {
            const dialogRef = this.dialog.open(SaveFileModalComponent);
            dialogRef.afterClosed().subscribe(async (result) => {
              if (result === UserActionEnum.CONFIRM) {
                const httpresult = await this.updateChangeFile();
                if (httpresult.status !== 200) {
                  this.dialog.open(UpdateHtmlErrorModalComponent, {
                    data: httpresult,
                  });
                } else {
                  this.getCSSFile(index);
                }
              }
            });
          } else {
            alert('validation fail please change the code');
          }
        } else {
          this.getCSSFile(index);
        }
      } else {
        this.getCSSFile(index);
      }
    }
  }
  onClickOpenJavascriptFile(index: number): void {
    this.srcImage = null;
    if (this.beforeCode !== 'image') {
      if (this.beforeCode !== JSON.stringify(this.monacoFormGroup.value.code)) {
        const isError = this.monacoContainer?.nativeElement?.querySelector('.squiggly-error');
        if (!isError) {
          const dialogRef = this.dialog.open(SaveFileModalComponent);
          dialogRef.afterClosed().subscribe(async (result) => {
            if (result === UserActionEnum.CONFIRM) {
              const httpresult = await this.updateChangeFile();
              if (httpresult.status !== 200) {
                this.dialog.open(UpdateHtmlErrorModalComponent, {
                  data: httpresult,
                });
              } else {
                this.getJavascriptFile(index);
              }
            }
          });
        } else {
          alert('validation fail please change the code');
        }
      } else {
        this.getJavascriptFile(index);
      }
    } else {
      this.getJavascriptFile(index);
    }
  }
  updateChangeFile(): Promise<IHTTPResult> {
    return new Promise((resolve) => {
      let file;
      switch (this.typeOfFile) {
        case 'html': {
          file = { type: EnumThemeHtmlType.HTML, plaintext: this.monacoFormGroup.value.code, index: this.beforeIndex, _id: this._id };
          break;
        }
        case 'css': {
          file = {
            type: EmumThemeResourceType.CSS,
            plaintext: this.monacoFormGroup.value.code,
            index: this.beforeIndex,
            _id: this._id,
            url: this.themeRendering.style[this.beforeIndex].url,
            name: this.themeRendering.style[this.beforeIndex].name,
          };
          break;
        }
        case 'javascript': {
          file = {
            type: EmumThemeResourceType.JS,
            plaintext: this.monacoFormGroup.value.code,
            index: this.beforeIndex,
            _id: this._id,
            url: this.themeRendering.javascript[this.beforeIndex].url,
            name: this.themeRendering.javascript[this.beforeIndex].name,
          };
          break;
        }
      }
      this.themeService
        .updateFileToCMSFileServer(file)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (HTTPResult) => {
            resolve(HTTPResult);
          },
          (err) => {
            this.openErrorDialog(err);
          },
        );
    });
  }
  getHTMlFile(index: number): void {
    const Id = { _id: this._id, index };
    this.themeService
      .getHtmlByThemeId(Id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (HTMLFileResponse) => {
          if (HTMLFileResponse.status === 200) {
            this.themeService.editorOptionsSubject.next('html');
            this.monacoFormGroup.patchValue({
              code: HTMLFileResponse.value.html,
            });
            this.topic = HTMLFileResponse.value.name;
            this.beforeCode = JSON.stringify(HTMLFileResponse.value.html);
            this.themeService.htmlIndex.next(index);
            this.htmlIndex = index;
            this.themeService.thumbnailUrl.next(HTMLFileResponse.value.thumbnail.path);
            this.beforeIndex = index;
          }
        },
        (err) => {
          this.openErrorDialog(err);
        },
      );
  }
  getCSSFile(index: number): void {
    const Id = { _id: this._id, index };
    this.themeService
      .getCssByThemeId(Id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (HTTPResult) => {
          if (HTTPResult.status === 200) {
            this.themeService.editorOptionsSubject.next('css');
            this.monacoFormGroup.patchValue({
              code: HTTPResult.value,
            });
            this.topic = this.themeRendering.style[index].name;
            this.setMonacoValidatorToCSS();
            this.beforeCode = JSON.stringify(HTTPResult.value);
            this.beforeIndex = index;
          }
        },
        (err) => {
          this.openErrorDialog(err);
        },
      );
  }
  getJavascriptFile(index: number): void {
    const Id = { _id: this._id, index };
    this.themeService.getJavascriptByThemeId(Id).subscribe(
      (HTTPResult) => {
        if (HTTPResult.status === 200) {
          this.themeService.editorOptionsSubject.next('javascript');
          this.monacoFormGroup.reset({
            code: HTTPResult.value,
          });
          this.topic = this.themeRendering.javascript[index].name;
          this.setMonacoValidatorToJavascript();
          this.beforeCode = JSON.stringify(HTTPResult.value);
          this.beforeIndex = index;
        }
      },
      (err) => {
        this.openErrorDialog(err);
      },
    );
  }
  getImageFile(file: IThemeAssets): void {
    this.topic = file.name;
    this.srcImage = file.url;
    this.beforeCode = 'image';
  }
  setMonacoValidatorToCSS(): void {
    monaco.languages.css.cssDefaults.setDiagnosticsOptions({
      validate: true,
    });
  }
  setMonacoValidatorToJavascript(): void {
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      validate: true,
    });
  }
  openErrorDialog(errMessage: string): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        type: ConfirmDialogType.DANGER,
        title: 'Got ERROR',
        content: errMessage,
      } as ConfirmDialogModel,
    });
  }
  dynamicIframeSize(): void {
    this.themeService.selectedIndex.pipe(takeUntil(this.destroy$)).subscribe(
      (index) => {
        this.minWidth = this.themeRendering.devices[index].minwidth + 'px';
      },
      (err) => {
        this.openErrorDialog(err);
      },
    );
  }
  changeIndexOfUrlIframe(index: number): string {
    const urlIframe = this.themeService.urlIframe.getValue();
    const urlIFrameSplit = urlIframe.split('/');
    urlIFrameSplit[urlIFrameSplit.length - 1] = index.toString();
    return urlIFrameSplit.join('/');
  }
  onClickAddLayout(): void {
    const defaultHtml = {
      name: `Index${this.themeRendering.html.length}.html`,
      html: `<section id="THEME_HEADER" ></section>
  <section id="CONTENT"></section>
  <section id="THEME_FOOTER"></section>`,
      thumbnail: {
        path: null,
        stream: null,
      },
    };
    this.themeService
      .createThemeLayoutHtmlFile(this._id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (result) => {
          if (result.status === 200) {
            this.themeRendering.html.push(defaultHtml);
          }
        },
        (err) => {
          this.openErrorDialog(err);
        },
      );
  }
}
