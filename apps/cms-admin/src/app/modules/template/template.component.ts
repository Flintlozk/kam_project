import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CreateModalTypeEnum, ITemplateData, TemplateTypeEnum } from '@reactor-room/cms-models-lib';
import { ConfirmDialogComponent, ConfirmDialogModel, ConfirmDialogType } from '@reactor-room/itopplus-cdk';
import { CreateModalComponent } from '../../components/create-modal/create-modal.component';
import { IHeadervariable } from '../../type/headerType';

@Component({
  selector: 'reactor-room-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss'],
})
export class TemplateComponent implements OnInit {
  constructor(public dialog: MatDialog) {}
  name: IHeadervariable = {
    topicName: 'Template',
    buttonName: 'Template',
  };
  templateData: ITemplateData[] = [
    {
      _id: '1',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '2',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '3',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '4',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '4',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '1',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '2',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '3',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '4',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '4',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '1',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '2',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '3',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '4',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '4',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '1',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '2',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '3',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '4',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '4',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '1',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '2',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '3',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '4',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '4',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '1',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '2',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '3',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '4',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '4',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '1',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '2',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '3',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '3',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '3',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '3',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '3',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '4',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '4',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '1',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '2',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '3',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '4',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '4',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.HEADER,
    },
    {
      _id: '5',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.SECTION,
    },
    {
      _id: '5',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.SECTION,
    },
    {
      _id: '5',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.SECTION,
    },
    {
      _id: '5',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.SECTION,
    },
    {
      _id: '5',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.SECTION,
    },
    {
      _id: '5',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.SECTION,
    },
    {
      _id: '5',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.SECTION,
    },
    {
      _id: '5',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.SECTION,
    },
    {
      _id: '5',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.SECTION,
    },
    {
      _id: '5',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.SECTION,
    },
    {
      _id: '5',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.SECTION,
    },
    {
      _id: '5',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.SECTION,
    },
    {
      _id: '5',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.SECTION,
    },
    {
      _id: '5',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.SECTION,
    },
    {
      _id: '5',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.SECTION,
    },
    {
      _id: '5',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.SECTION,
    },
    {
      _id: '5',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.SECTION,
    },
    {
      _id: '5',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.SECTION,
    },
    {
      _id: '5',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.SECTION,
    },
    {
      _id: '5',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.SECTION,
    },
    {
      _id: '5',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.SECTION,
    },
    {
      _id: '5',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.SECTION,
    },
    {
      _id: '5',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.SECTION,
    },
    {
      _id: '5',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.SECTION,
    },
    {
      _id: '5',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.SECTION,
    },
    {
      _id: '5',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.SECTION,
    },
    {
      _id: '5',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.SECTION,
    },
    {
      _id: '5',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.SECTION,
    },

    {
      _id: '6',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.GALLERY,
    },
    {
      _id: '6',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.GALLERY,
    },

    {
      _id: '6',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.GALLERY,
    },
    {
      _id: '6',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.GALLERY,
    },
    {
      _id: '6',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.GALLERY,
    },
    {
      _id: '6',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.GALLERY,
    },
    {
      _id: '7',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.SECTION,
    },
    {
      _id: '8',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.FOOTER,
    },
    {
      _id: '8',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.FOOTER,
    },
    {
      _id: '8',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.FOOTER,
    },
    {
      _id: '8',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.FOOTER,
    },
    {
      _id: '8',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.FOOTER,
    },
    {
      _id: '8',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.FOOTER,
    },
    {
      _id: '8',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.FOOTER,
    },
    {
      _id: '8',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.FOOTER,
    },

    {
      _id: '8',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.VIDEO,
    },
    {
      _id: '8',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.VIDEO,
    },
    {
      _id: '8',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.VIDEO,
    },
    {
      _id: '8',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.PAGE,
    },
    {
      _id: '8',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.PAGE,
    },
    {
      _id: '8',
      name: '',
      thumbnail: '',
      type: TemplateTypeEnum.PAGE,
    },
  ];
  ngOnInit(): void {}
  onAddNewTemplate() {
    const dialogRef = this.dialog.open(CreateModalComponent, {
      data: { name: '', type: CreateModalTypeEnum.TEMPLATE },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
      }
    });
  }
  openErrorDialog(errMessage: string): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        type: ConfirmDialogType.DANGER,
        title: 'Got ERROR',
        content: errMessage,
      } as ConfirmDialogModel,
    });
  }
}
