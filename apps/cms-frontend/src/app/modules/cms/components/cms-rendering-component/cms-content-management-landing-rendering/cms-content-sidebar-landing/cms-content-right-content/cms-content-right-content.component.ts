import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { IContentEditor, IContentEditorLanguage, ILanguage, RightContentType } from '@reactor-room/cms-models-lib';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { CmsCommonService } from '../../../../../services/cms-common.service';

@Component({
  selector: 'cms-next-cms-content-right-content',
  templateUrl: './cms-content-right-content.component.html',
  styleUrls: ['./cms-content-right-content.component.scss'],
})
export class CmsContentRightContentComponent implements OnInit, OnDestroy {
  RightContentType = RightContentType;
  @Input() rightContentType: RightContentType;
  @Input() content: IContentEditor;
  displayContentLanguage: IContentEditorLanguage;
  destroy$ = new Subject();
  constructor(private commonService: CmsCommonService) {}

  ngOnInit(): void {
    this.commonService.getCmsLanguageSwitch
      .pipe(
        takeUntil(this.destroy$),
        tap((language: ILanguage) => {
          if (!language) return;
          this.displayContentLanguage = this.content.language.find((lang) => lang.cultureUI === language.cultureUI);
        }),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }
}
