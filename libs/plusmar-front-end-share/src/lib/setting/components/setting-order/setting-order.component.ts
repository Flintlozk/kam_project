import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SettingOrderPrefixDialogComponent, SettingOrderExpiredDialogComponent } from './components';

@Component({
  selector: 'reactor-room-setting-order',
  templateUrl: './setting-order.component.html',
  styleUrls: ['./setting-order.component.scss'],
})
export class SettingOrderComponent implements OnInit {
  prefixText = 'TH';
  expiredDays = 3;

  constructor(private prefixDialog: MatDialog, private expiredDialog: MatDialog) {}

  openPrefixDialog(): void {
    const dialogRef = this.prefixDialog.open(SettingOrderPrefixDialogComponent, {
      width: '100%',
      data: this.prefixText,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.prefixText = result;
    });
  }

  openExpiredDialog(): void {
    const dialogRef = this.expiredDialog.open(SettingOrderExpiredDialogComponent, {
      width: '100%',
      data: this.expiredDays,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.expiredDays = result;
    });
  }

  ngOnInit(): void {}
}
