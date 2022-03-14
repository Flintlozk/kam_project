import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IThemeUpdateErrorModal } from '@reactor-room/cms-models-lib';
import { IHTTPResult } from '@reactor-room/model-lib';

@Component({
  selector: 'reactor-room-update-html-error-modal',
  templateUrl: './update-html-error-modal.component.html',
  styleUrls: ['./update-html-error-modal.component.scss'],
})
export class UpdateHtmlErrorModalComponent implements OnInit {
  constructor(public dialog: MatDialogRef<UpdateHtmlErrorModalComponent>, @Inject(MAT_DIALOG_DATA) public errorData: IHTTPResult) {
    if (errorData.status === 405) {
      this.title = errorData.value;
    } else {
      this.title = 'Please change the error style';
      this.dataSource = JSON.parse(errorData.value);
    }
  }
  title: string;
  dataSource: any;
  displayedColumns: string[] = ['difference', 'dataId', 'componentType'];
  ngOnInit(): void {}
}
