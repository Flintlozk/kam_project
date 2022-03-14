import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SettingKbankDialogComponent } from '../setting-kbank-dialog/setting-kbank-dialog.component';

@Component({
  selector: 'reactor-room-setting-kbank-detail',
  templateUrl: './setting-kbank-detail.component.html',
  styleUrls: ['./setting-kbank-detail.component.scss'],
})
export class SettingKbankDetailComponent implements OnInit {
  merchantID = '';
  feePercent = (0.0).toFixed(2);
  feeValue = (0.0).toFixed(2);
  minimumValue = (0.0).toFixed(2);

  constructor(private dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(SettingKbankDialogComponent, {
      width: '100%',
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.merchantID = result.merchantID;
      this.feePercent = result.feePercent;
      this.feeValue = result.feeValue;
      this.minimumValue = result.minimumValue;
    });
  }

  ngOnInit(): void {}
}
