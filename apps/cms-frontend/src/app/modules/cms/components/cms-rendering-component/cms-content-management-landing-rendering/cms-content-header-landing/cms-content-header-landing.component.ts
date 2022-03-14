import { Component, OnDestroy, OnInit } from '@angular/core';
import { IContentEditor, IContentEditorLanguage, ILanguage } from '@reactor-room/cms-models-lib';
import { Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import { CmsCommonService } from '../../../../services/cms-common.service';
import { CmsContentEditService } from '../../../../services/cms-content-edit.service';

@Component({
  selector: 'cms-next-cms-content-header-landing',
  templateUrl: './cms-content-header-landing.component.html',
  styleUrls: ['./cms-content-header-landing.component.scss'],
})
export class CmsContentHeaderLandingComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();
  contentEditor: IContentEditor;
  displayContentLanguage: IContentEditorLanguage;
  constructor(private cmsContentEditService: CmsContentEditService, private commonService: CmsCommonService) {}

  ngOnInit(): void {
    this.cmsContentEditService.$contents
      .pipe(
        takeUntil(this.destroy$),
        switchMap((val) => {
          if (val) {
            this.contentEditor = val;
            return this.commonService.getCmsLanguageSwitch;
          }
        }),
        tap((language: ILanguage) => {
          if (!language) return;
          this.displayContentLanguage = this.contentEditor.language.find((lang) => lang.cultureUI === language.cultureUI);
        }),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
