import { Component, OnInit } from '@angular/core';
import { RouteLinkCmsEnum } from '@reactor-room/cms-models-lib';
import { CmsPreviewService } from '../../../services/cms-preview.service';
import { EPreviewMode, IPreviewMode } from '../../../shared/cms-preview.model';

@Component({
  selector: 'cms-next-cms-preview',
  templateUrl: './cms-preview.component.html',
  styleUrls: ['./cms-preview.component.scss'],
  animations: [],
})
export class CmsPreviewComponent implements OnInit {
  isPreviewMode = false;
  currentPreviewMode: string;
  RouteLinkCmsEnum = RouteLinkCmsEnum;

  previewModes: IPreviewMode[] = [
    {
      mode: EPreviewMode.DESKTOP,
      imgUrl: 'assets/cms/preview-mode/desktop.svg',
      imgActiveUrl: 'assets/cms/preview-mode/desktop-a.svg',
    },
    {
      mode: EPreviewMode.TABLET,
      imgUrl: 'assets/cms/preview-mode/tablet.svg',
      imgActiveUrl: 'assets/cms/preview-mode/tablet-a.svg',
    },
    {
      mode: EPreviewMode.MOBILE,
      imgUrl: 'assets/cms/preview-mode/mobile.svg',
      imgActiveUrl: 'assets/cms/preview-mode/mobile-a.svg',
    },
  ];

  constructor(private cmsPreviewService: CmsPreviewService) {}

  ngOnInit(): void {
    this.currentPreviewMode = EPreviewMode.DESKTOP;
  }

  onActivePreviewMode(): void {
    this.isPreviewMode = true;
    this.cmsPreviewService.updateIsPreviewMode(true);
  }

  onInactivePreviewMode(): void {
    this.isPreviewMode = false;
    this.cmsPreviewService.updateIsPreviewMode(false);
  }

  onSetPreviewMode(mode: EPreviewMode): void {
    this.currentPreviewMode = mode;
    this.cmsPreviewService.updatePreviewMode(mode);
  }

  trackByIndex(index: number): number {
    return index;
  }
}
