import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CreateModalTypeEnum, ICreateModal, TemplateTypeEnum } from '@reactor-room/cms-models-lib';

@Component({
  selector: 'reactor-room-create-modal',
  templateUrl: './create-modal.component.html',
  styleUrls: ['./create-modal.component.scss'],
})
export class CreateModalComponent implements OnInit {
  constructor(public dialog: MatDialogRef<CreateModalComponent>, @Inject(MAT_DIALOG_DATA) public modalData: ICreateModal) {}
  CreateModalTypeEnum = CreateModalTypeEnum;
  TemplateTypeEnum = TemplateTypeEnum;
  templateTypeList: TemplateTypeEnum[] = [
    TemplateTypeEnum.HEADER,
    TemplateTypeEnum.SECTION,
    TemplateTypeEnum.GALLERY,
    TemplateTypeEnum.VIDEO,
    TemplateTypeEnum.PAGE,
    TemplateTypeEnum.FOOTER,
  ];
  ngOnInit(): void {}
  onNoClick(): void {
    this.dialog.close();
  }
  onPressEnter(): void {
    this.dialog.close(this.modalData);
  }
}
