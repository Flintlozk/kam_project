import { Component, OnInit } from '@angular/core';
import { RouteAnimate } from '@reactor-room/animation';
import { CmsPreviewService } from '../../services/cms-preview.service';
import { EPreviewMode } from '../../shared/cms-preview.model';

@Component({
  selector: 'cms-next-cms-preview-mode',
  templateUrl: './cms-preview-mode.component.html',
  styleUrls: ['./cms-preview-mode.component.scss'],
  animations: [RouteAnimate.routeCMSAnimation],
})
export class CmsPreviewModeComponent implements OnInit {
  previewMode: string;
  EPreviewMode = EPreviewMode;
  constructor(private cmsPreviewService: CmsPreviewService) {
    this.cmsPreviewService.getPreviewMode.subscribe((mode) => {
      this.previewMode = mode;
    });
  }

  ngOnInit(): void {}
}
