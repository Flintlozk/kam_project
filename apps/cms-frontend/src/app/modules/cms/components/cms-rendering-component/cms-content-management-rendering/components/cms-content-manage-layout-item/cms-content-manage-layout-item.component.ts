import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { IContentEditor, IContentEditorLanguage, IContentManagementContents, ILanguage } from '@reactor-room/cms-models-lib';
import * as dayjs from 'dayjs';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { CmsCommonService } from '../../../../../services/cms-common.service';

@Component({
  selector: 'cms-next-cms-content-manage-layout-item',
  templateUrl: './cms-content-manage-layout-item.component.html',
  styleUrls: ['./cms-content-manage-layout-item.component.scss'],
})
export class CmsContentManageLayoutItemComponent implements OnInit, OnChanges {
  @Input() content: IContentEditor;
  displayContentLanguage: IContentEditorLanguage;
  @Input() contentSetting: IContentManagementContents;
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

  ngOnChanges(): void {
    this.content.startDate = dayjs(this.content.startDate).format('DD/MM/YYYY');
  }

  trackByIndex(index: number): number {
    return index;
  }
}
