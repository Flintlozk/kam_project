import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { ITaskDetail } from '@reactor-room/crm-models-lib';
import { getUTCDateFromString, getUTCTimestamps, NgNeat } from '@reactor-room/itopplus-front-end-helpers';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TaskService } from '../../modules/task/services/task.service';
import { ModalErrorComponent } from '../modal-error/modal-error.component';
@Component({
  selector: 'reactor-room-form-start-end-date',
  templateUrl: './form-start-end-date.component.html',
  styleUrls: ['./form-start-end-date.component.scss'],
})
export class FormStartEndDateComponent implements OnInit, OnChanges {
  @Input() uuidTask: string;
  @Input() cardDetailInput: ITaskDetail;
  destroy$: Subject<boolean> = new Subject<boolean>();
  dateForm = this.fb.group({
    startDate: [''],
    endDate: [''],
    uuidTask: [''],
  });
  ngNeat: NgNeat;
  constructor(private fb: FormBuilder, private taskService: TaskService, public toast: HotToastService, public dialog: MatDialog) {
    this.ngNeat = new NgNeat(toast);
  }

  ngOnInit(): void {
    this.dateForm.patchValue({
      uuidTask: this.uuidTask,
    });
  }

  updateDealDate() {
    this.taskService
      .updateDealDateForTask(this.dateForm.value)
      .pipe(this.ngNeat.hotToast(), takeUntil(this.destroy$))
      .subscribe(
        () => {},
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
  ngOnChanges() {
    this.dateForm.patchValue({
      startDate: getUTCDateFromString(this.cardDetailInput.startDate),
      endDate: getUTCDateFromString(this.cardDetailInput.endDate),
      uuidTask: this.uuidTask,
    });
  }
}
