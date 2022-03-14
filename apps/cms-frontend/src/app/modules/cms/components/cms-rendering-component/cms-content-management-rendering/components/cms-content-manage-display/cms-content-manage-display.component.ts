import { Component, Input, OnInit } from '@angular/core';
import { EContentManagementGeneralDisplay, IContentManagementGeneralDisplay } from '@reactor-room/cms-models-lib';

@Component({
  selector: 'cms-next-cms-content-manage-display',
  templateUrl: './cms-content-manage-display.component.html',
  styleUrls: ['./cms-content-manage-display.component.scss'],
})
export class CmsContentManageDisplayComponent implements OnInit {
  @Input() display: IContentManagementGeneralDisplay;
  EContentManagementGeneralDisplay = EContentManagementGeneralDisplay;
  constructor() {}

  ngOnInit(): void {}
}
