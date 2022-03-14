import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StatusSnackbarComponent, StatusSnackbarModel, StatusSnackbarType } from '@reactor-room/itopplus-cdk';
import { SettingWebsiteService } from 'apps/cms-frontend/src/app/services/setting-webiste.service';
import { forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CmsPreviewService } from '../../services/cms-preview.service';
import { CmsEditThemeService } from '../../services/cms-theme.service';
import { WebsiteService } from '../../services/website.service';
@Component({
  selector: 'cms-next-cms-edit-mode',
  templateUrl: './cms-edit-mode.component.html',
  styleUrls: ['./cms-edit-mode.component.scss'],
})
export class CmsEditModeComponent implements OnInit {
  maxWidth = 1400;
  isPreviewMode: boolean;
  @ViewChild('templateContainer') templateContainer: ElementRef;
  @ViewChild('templateChild') templateChild: ElementRef;
  constructor(
    private cmsPreviewService: CmsPreviewService,
    private cmsThemeService: CmsEditThemeService,
    private websiteService: WebsiteService,
    private settingWebsiteService: SettingWebsiteService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    forkJoin([
      this.websiteService.getTheme().pipe(
        tap((pageTheme) => {
          this.websiteService.$pageTheme.next(pageTheme);
        }),
      ),
      this.websiteService.getSharingThemeConfigAndSetThemeSharing().pipe(
        tap((themeConfig) => {
          this.websiteService.$sharingThemeConfig.next(themeConfig);
        }),
      ),
      this.settingWebsiteService.getConfigStyle().pipe(
        tap((style) => {
          this.settingWebsiteService.$configStyle.next(style);
        }),
      ),
    ]).subscribe({
      next: () => {},
      error: (error: HttpErrorResponse) => {
        this.showUnexpectedError(error.message);
      },
      complete: () => {
        console.log('COMPLETE');
      },
    });

    this.cmsPreviewService.getIsPreviewMode
      .pipe(
        tap((isPreviewMode) => {
          this.isPreviewMode = isPreviewMode;
        }),
      )
      .subscribe();
  }

  showUnexpectedError(errorMessage: string): void {
    this.snackBar.openFromComponent(StatusSnackbarComponent, {
      data: {
        type: StatusSnackbarType.ERROR,
        message: 'Unexpected Error occured...Try again later!' + errorMessage,
      } as StatusSnackbarModel,
    });
  }

  @HostListener('document:dblclick', ['$event.target']) onMouseDown(targetElement: HTMLElement): void {
    const templateContainer = this.templateContainer.nativeElement.contains(targetElement);
    const templateChild = this.templateChild.nativeElement.contains(targetElement);
    if (templateContainer && !templateChild) {
      this.cmsThemeService.setThemeFocus(true);
    } else {
      this.cmsThemeService.setThemeFocus(false);
    }
  }
}
