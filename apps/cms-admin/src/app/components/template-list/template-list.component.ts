import { Component, Input, OnInit } from '@angular/core';
import { ITemplateData, TemplateTypeEnum } from '@reactor-room/cms-models-lib';
import _, { Dictionary } from 'lodash';
@Component({
  selector: 'reactor-room-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss'],
})
export class templateListComponent implements OnInit {
  constructor() {}
  groupTemplate: Dictionary<ITemplateData[]>;
  mode: TemplateTypeEnum = TemplateTypeEnum.ALL;
  TemplateTypeEnum = TemplateTypeEnum;
  allPages: number;
  groupAll: Dictionary<ITemplateData[]>;
  groupView: Dictionary<ITemplateData[]>;
  @Input() templateData: ITemplateData[];
  limit = 20;
  ngOnInit(): void {
    this.groupTemplate = _.groupBy(this.templateData, 'type');
    this.groupAll = JSON.parse(JSON.stringify(this.groupTemplate));
    const objectKeys = Object.keys(this.groupTemplate);
    for (const key of objectKeys) {
      this.groupAll[key].splice(5);
    }
    this.groupView = JSON.parse(JSON.stringify(this.groupAll));
  }
  trackByIndex(index: number): number {
    return index;
  }
  onClickChangeModeHeader(): void {
    this.changeMode(TemplateTypeEnum.HEADER);
  }
  onClickChangeModeSection(): void {
    this.changeMode(TemplateTypeEnum.SECTION);
  }
  onClickChangeModeGallery(): void {
    this.changeMode(TemplateTypeEnum.GALLERY);
  }
  onClickChangeModeVideo(): void {
    this.changeMode(TemplateTypeEnum.VIDEO);
  }
  onClickChangeModePage(): void {
    this.changeMode(TemplateTypeEnum.PAGE);
  }
  onClickChangeModeFooter(): void {
    this.changeMode(TemplateTypeEnum.FOOTER);
  }
  changeMode(type: TemplateTypeEnum): void {
    if (this.mode === TemplateTypeEnum.ALL) {
      this.mode = type;
      console.log(this.groupTemplate);
      this.allPages = Math.ceil(this.groupTemplate[type].length / this.limit);
      const groupTemplate = JSON.parse(JSON.stringify(this.groupTemplate[type]));
      this.groupView[type] = groupTemplate.splice(0, 20);
    } else {
      this.mode = TemplateTypeEnum.ALL;
      this.groupView = JSON.parse(JSON.stringify(this.groupAll));
    }
  }
  onPageChange(page: number): void {
    if (page <= this.allPages) {
      this.groupView[this.mode] = this.groupTemplate[this.mode].slice((page - 1) * 20, page * 20);
    }
  }
}
