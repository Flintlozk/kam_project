import { Input, Output, EventEmitter, Directive, HostListener, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmMessageComponent } from './confirm-message/confirm-message.component';

enum DIALOG_TYPE {
  CONFIRM_YES_CANCEL = 1,
}
export interface DialogData {
  title: string;
  message: string;
  thirdButton: string;
  secoundButton: string;
  firstButton: string;
}
@Directive({ selector: '[reactorRoomDialogBox]' })
export class ConfirmBoxDirective implements OnInit {
  @Input() dialogBoxWidth: string;
  @Input() dialogBoxData: DialogData;
  @Input() dialogBoxType: DIALOG_TYPE;

  @Output() dialogBoxClose = new EventEmitter();

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    if (this.dialogBoxData === undefined) {
      switch (this.dialogBoxType) {
        default: {
          this.dialogBoxData = {
            message: 'คุณแน่ใจจะลบข้อมูลนี้หรือไม่',
            title: 'ยืนยันการลบข้อมูล',
            firstButton: 'Yes',
            secoundButton: 'Cancel',
            thirdButton: '',
          };
        }
      }
    }
  }

  @HostListener('click') mouseClick() {
    const dialogRef = this.dialog.open(ConfirmMessageComponent, { width: this.dialogBoxWidth, data: this.dialogBoxData });
    dialogRef.afterClosed().subscribe((result: DialogData) => {
      this.dialogBoxClose.emit(result);
    });
  }
}
