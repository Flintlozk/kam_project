import { Component, Input, OnInit } from '@angular/core';
import { EContentManagementGeneralBottomType, IContentManagementGeneralBottom, ETextAlignment, EContentManagementGeneralBottomPaginationType } from '@reactor-room/cms-models-lib';

@Component({
  selector: 'cms-next-cms-content-manage-bottom',
  templateUrl: './cms-content-manage-bottom.component.html',
  styleUrls: ['./cms-content-manage-bottom.component.scss'],
})
export class CmsContentManageBottomComponent implements OnInit {
  @Input() bottom: IContentManagementGeneralBottom;
  EContentManagementGeneralBottomType = EContentManagementGeneralBottomType;
  EContentManagementGeneralBottomPaginationType = EContentManagementGeneralBottomPaginationType;
  ETextAlignment = ETextAlignment;
  constructor() {}

  ngOnInit(): void {}
}
