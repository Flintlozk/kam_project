import { Component, OnInit } from '@angular/core';
import { SettingPaySolutionsDialogComponent } from '../setting-pay-solutions-dialog/setting-pay-solutions-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'reactor-room-setting-pay-solutions-detail',
  templateUrl: './setting-pay-solutions-detail.component.html',
  styleUrls: ['./setting-pay-solutions-detail.component.scss'],
})
export class SettingPaySolutionsDetailComponent implements OnInit {
  merchantID = '';
  feePercent = (0.0).toFixed(2);
  feeValue = (0.0).toFixed(2);
  minimumValue = (0.0).toFixed(2);

  constructor(private dialog: MatDialog) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(SettingPaySolutionsDialogComponent, {
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
