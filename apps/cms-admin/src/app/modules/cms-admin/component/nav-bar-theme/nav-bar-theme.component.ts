import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray } from '@angular/forms';
import { EnumActionThemeMode, EnumThemeMode, IThemeRenderingHtml } from '@reactor-room/cms-models-lib';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'reactor-room-nav-bar-theme',
  templateUrl: './nav-bar-theme.component.html',
  styleUrls: ['./nav-bar-theme.component.scss'],
})
export class NavBarThemeComponent implements OnInit {
  @Output() saveThemeHandler = new EventEmitter<EnumActionThemeMode>();
  @Output() deleteThemeHandler = new EventEmitter<EnumActionThemeMode>();
  isPreviewMode: boolean;
  destroy$ = new Subject();
  selectedDarkTheme: boolean;
  devices: FormArray;
  selectedIndex: number;
  htmlFils: IThemeRenderingHtml[];
  fileName: string;
  constructor(private themeService: ThemeService) {
    this.themeService.getIsPreviewMode.pipe(takeUntil(this.destroy$)).subscribe((status) => (this.isPreviewMode = status));
    this.themeService.getDevices.pipe(takeUntil(this.destroy$)).subscribe((device) => {
      this.devices = device;
    });
    this.themeService.getSelectedIndex.pipe(takeUntil(this.destroy$)).subscribe((index) => {
      this.selectedIndex = index;
    });
    this.themeService.htmlFiles.pipe(takeUntil(this.destroy$)).subscribe((htmlFiles) => {
      this.htmlFils = htmlFiles;
    });
  }
  buttonText: string;
  mode: string;
  ngOnInit(): void {
    this.themeService.htmlIndex.pipe(takeUntil(this.destroy$)).subscribe((index) => {
      const htmlFiles = this.themeService.htmlFiles.getValue();
      if (htmlFiles !== null) {
        const fileName = htmlFiles[index].name;
        this.fileName = fileName;
      }
    });
  }
  onClickSaveTheme() {
    this.saveThemeHandler.emit(EnumActionThemeMode.SAVE);
  }
  onClickDeleteTheme(): void {
    this.deleteThemeHandler.emit();
  }
  onActivePreviewMode(): void {
    this.selectedDarkTheme = false;
    this.themeService.updateSelectedIndex(this.selectedIndex);
    this.saveThemeHandler.emit(EnumActionThemeMode.PREVIEW);
  }

  onInActivePreviewMode(): void {
    this.themeService.updateIsPreviewMode(false);
  }
  onClickDarkTheme(): void {
    if (this.selectedDarkTheme === false) {
      this.selectedDarkTheme = true;
      this.toggleClassMode(EnumThemeMode.DARK);
    }
  }
  onClickLightTheme(): void {
    if (this.selectedDarkTheme === true) {
      this.selectedDarkTheme = false;
      this.toggleClassMode(EnumThemeMode.LIGHT);
    }
  }

  toggleClassMode(type: EnumThemeMode): void {
    const iframe = document.getElementById('iframeId') as HTMLIFrameElement;
    iframe.contentWindow.postMessage(type, '*');
  }
  onClickDevices(index: number): void {
    this.themeService.updateSelectedIndex(index);
  }
  selectedHtmlFileName(index: number) {
    const url = this.changeIndexOfUrlIframe(index);
    const iframeElement = document.getElementById('iframeId') as HTMLIFrameElement;
    iframeElement.src = url;
  }
  changeIndexOfUrlIframe(index: number): string {
    const urlIframe = this.themeService.urlIframe.getValue();
    const urlIFrameSplit = urlIframe.split('/');
    urlIFrameSplit[urlIFrameSplit.length - 1] = index.toString();
    return urlIFrameSplit.join('/');
  }
}
