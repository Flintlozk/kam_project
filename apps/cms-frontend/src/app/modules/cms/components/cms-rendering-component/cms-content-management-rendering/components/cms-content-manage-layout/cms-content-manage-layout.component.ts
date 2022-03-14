import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { IContentEditor, IContentManagementContents, IContentManagementPatternStyle, IContentManagementRenderingSetting, ILayoutStyle } from '@reactor-room/cms-models-lib';
import { deepCopy } from '@reactor-room/itopplus-front-end-helpers';
import { chunk } from 'lodash';

@Component({
  selector: 'cms-next-cms-content-manage-layout',
  templateUrl: './cms-content-manage-layout.component.html',
  styleUrls: ['./cms-content-manage-layout.component.scss'],
})
export class CmsContentManageLayoutComponent implements OnInit, OnChanges {
  @Input() contentManagementValue: IContentManagementRenderingSetting;
  @Input() contentCategoryData: IContentEditor[];
  @Input() changeDetectorTrigger: boolean;
  @Input() changeDetectorPatternTrigger: boolean;
  contentSetting: IContentManagementContents;

  contentCategoryDataChuck: IContentEditor[][][][];
  layoutStyle: ILayoutStyle;
  safeCSS: SafeHtml = null;
  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.contentCategoryDataChuck = this.getContentChuck(this.contentManagementValue.general.pattern.patternStyle, this.contentCategoryData);
    this.layoutStyle = this.getLayoutStyle(this.contentManagementValue.general.pattern.patternStyle);
    this.contentSetting = this.contentManagementValue.contents;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const changeDetectorPatternTrigger = changes?.changeDetectorPatternTrigger;
    if (changeDetectorPatternTrigger?.currentValue !== null) {
      this.contentCategoryDataChuck = this.getContentChuck(this.contentManagementValue.general.pattern.patternStyle, this.contentCategoryData);
      this.layoutStyle = this.getLayoutStyle(this.contentManagementValue.general.pattern.patternStyle);
      this.contentSetting = this.contentManagementValue.contents;
    }
  }

  trackByIndex(index: number): number {
    return index;
  }

  getContentChuck(patternStyle: IContentManagementPatternStyle, contentCategoryData: IContentEditor[]): IContentEditor[][][][] {
    const contentArrayChuck = [];
    const maxPrimaryContent = patternStyle?.primary?.maxContent ? patternStyle?.primary?.maxContent : 0;
    const maxSecondaryContent = patternStyle?.secondary?.maxContent ? patternStyle?.secondary?.maxContent : 0;
    const maxItemPerRow = maxPrimaryContent + maxSecondaryContent;
    const layoutArrayChuck: IContentEditor[][] = chunk(contentCategoryData, maxItemPerRow);
    layoutArrayChuck.forEach((layoutChuck) => {
      contentArrayChuck.push(layoutChuck);
    });
    contentArrayChuck.forEach((contentChuck: IContentEditor[], index: number) => {
      const deepCopyPrimary = deepCopy(contentChuck);
      const deepCopySecondary = deepCopy(contentChuck);
      const primary = deepCopyPrimary.splice(0, maxPrimaryContent);
      const secondary = deepCopySecondary.splice(maxPrimaryContent, maxSecondaryContent);
      contentArrayChuck[index] = [primary, secondary];
    });
    return contentArrayChuck;
  }

  getLayoutStyle(patternStyle: IContentManagementPatternStyle): ILayoutStyle {
    const layoutStyle: ILayoutStyle = {
      container: {
        display: 'grid',
        gridTemplateColumns: '',
        gridTemplateRows: '',
        gridGap: '',
      },
      primary: {
        display: 'grid',
        gridTemplateColumns: '',
        gridTemplateRows: '',
        gridGap: '',
      },
      secondary: {
        display: 'grid',
        gridTemplateColumns: '',
        gridTemplateRows: '',
        gridGap: '',
      },
      css: '',
    };
    layoutStyle.container.gridTemplateColumns = patternStyle.container.gridTemplateColumns;
    layoutStyle.container.gridTemplateRows = patternStyle.container.gridTemplateRows;
    layoutStyle.container.gridGap = patternStyle.container.gridGap;
    layoutStyle.primary.gridTemplateColumns = patternStyle.primary.grid.gridTemplateColumns;
    layoutStyle.primary.gridTemplateRows = patternStyle.primary.grid.gridTemplateRows;
    layoutStyle.primary.gridGap = patternStyle.primary.grid.gridGap;
    layoutStyle.secondary.gridTemplateColumns = patternStyle.secondary.grid.gridTemplateColumns;
    layoutStyle.secondary.gridTemplateRows = patternStyle.secondary.grid.gridTemplateRows;
    layoutStyle.secondary.gridGap = patternStyle.secondary.grid.gridGap;
    layoutStyle.css = patternStyle.css;
    this.safeCSS = this.getSafeCSSRendering(layoutStyle.css);
    return layoutStyle;
  }

  getSafeCSSRendering(css: string): SafeHtml {
    const type = `<style>${css}</style>`;
    return this.sanitizer.bypassSecurityTrustHtml(type) as SafeHtml;
  }
}
