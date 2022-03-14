import { Component, Input, OnInit } from '@angular/core';
import { IContentEditor } from '@reactor-room/cms-models-lib';

@Component({
  selector: 'cms-next-cms-content-manage-layout-item',
  templateUrl: './cms-content-manage-layout-item.component.html',
  styleUrls: ['./cms-content-manage-layout-item.component.scss'],
})
export class CmsContentManageLayoutItemComponent implements OnInit {
  @Input() content: IContentEditor;
  constructor() {}

  ngOnInit(): void {}

  trackByIndex(index: number): number {
    return index;
  }
}
