import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { Action, IDealAssign, ITaskDetail } from '@reactor-room/crm-models-lib';
import { NgNeat } from '@reactor-room/itopplus-front-end-helpers';
import { IHTTPResult } from '@reactor-room/model-lib';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TaskService } from '../../modules/task/services/task.service';
import { ITaskDealList } from '../../modules/task/task.model';
import { FormEditDealComponent } from '../form-edit-deal/form-edit-deal.component';
import { ModalConfirmDeleteComponent } from '../modal-confirm-delete/modal-confirm-delete.component';
import { ModalErrorComponent } from '../modal-error/modal-error.component';

@Component({
  selector: 'reactor-room-deal-form-detail',
  templateUrl: './deal-form-detail.component.html',
  styleUrls: ['./deal-form-detail.component.scss'],
})
export class DealFormDetailComponent {
  constructor(public dialog: MatDialog, private taskService: TaskService, public toast: HotToastService) {
    this.ngNeat = new NgNeat(toast);
  }
  @Input() taskDealList: ITaskDealList[];
  @Input() allAssignee: IDealAssign[];
  @Input() uuidTask: string;
  @Input() taskItem: ITaskDetail;
  @Output() deleteDealFromList = new EventEmitter<ITaskDealList>();
  ngNeat: NgNeat;
  destroy$: Subject<boolean> = new Subject<boolean>();
  onClickOpenEditDealDialog(taskDeal: ITaskDealList) {
    this.taskService
      .getDealDetailByUuidDeal(taskDeal.uuidDeal)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (dealDetail) => {
          const dialogRef = this.dialog.open(FormEditDealComponent, {
            data: { uuidTask: this.uuidTask, allAssignee: this.allAssignee, taskItem: this.taskItem, dealDetail: dealDetail, uuidDeal: taskDeal.uuidDeal },
          });
        },
        (err) => {
          this.openErrorDialog(err);
        },
      );
  }
  openErrorDialog(err: string): void {
    this.dialog.open(ModalErrorComponent, {
      data: {
        text: err,
      },
    });
  }

  onClickDeleteDeal(taskDeal: ITaskDealList) {
    this.deleteDealFromList.emit(taskDeal);
  }
}
