import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ILogisticsBundle, ILogisticsOperator } from '@reactor-room/itopplus-model-lib';
import { LogisticsService } from '../logistics.service';
import { AddBundleDialogComponent } from './add-bundle-dialog/add-bundle-dialog.component';

@Component({
  selector: 'admin-logistic-operator',
  templateUrl: './logistic-operator.component.html',
  styleUrls: ['./logistic-operator.component.scss'],
})
export class LogisticOperatorComponent implements OnInit {
  @Input() data: ILogisticsOperator;
  @Output() bundleAdded = new EventEmitter<number>();
  @Output() updated = new EventEmitter<boolean>();
  constructor(public dialog: MatDialog, public logisticsService: LogisticsService) {}

  ngOnInit(): void {}

  openDialog(): void {
    const dialogRef = this.dialog.open(AddBundleDialogComponent, {
      width: '520px',
      data: {
        operator: this.data.title,
        logistic_operator_id: this.data.logistic_operator_id,
      },
    });

    dialogRef.afterClosed().subscribe((result: number) => {
      if (result) {
        this.bundleAdded.emit(result);
      }
    });
  }

  trackBy(index: number, el: ILogisticsBundle): number {
    return el.id;
  }

  emitGetLogisticBundles(bool: boolean): void {
    this.updated.emit(bool);
  }
}
