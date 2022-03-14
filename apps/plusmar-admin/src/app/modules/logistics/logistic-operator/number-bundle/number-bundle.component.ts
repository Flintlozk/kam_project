import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ILogisticsBundle } from '@reactor-room/itopplus-model-lib';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import * as dayjs from 'dayjs';
import { LogisticsService } from '../../logistics.service';
@Component({
  selector: 'admin-number-bundle',
  templateUrl: './number-bundle.component.html',
  styleUrls: ['./number-bundle.component.scss'],
})
export class NumberBundleComponent implements OnInit {
  dayjs = dayjs;
  @Input() bundle: ILogisticsBundle;
  @Output() updated: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public logisticsService: LogisticsService, public dialog: MatDialog) {}

  ngOnInit(): void {}

  requestConfirm(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '520px',
    });
    dialogRef.afterClosed().subscribe((yes: boolean) => {
      if (yes) this.deleteBundle(this.bundle.id);
    });
  }

  deleteBundle(id: number): void {
    // const saveResponseToState = (result) => this.logisticsService.logisticsBundles.next(result);
    this.logisticsService.deleteBundle(id).subscribe(() => {
      this.updated.emit(true);
    });
  }
}
