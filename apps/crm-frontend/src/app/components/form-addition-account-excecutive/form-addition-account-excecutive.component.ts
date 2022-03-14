import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { ITaskDetail } from '@reactor-room/crm-models-lib';
import { NgNeat } from '@reactor-room/itopplus-front-end-helpers';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TaskService } from '../../modules/task/services/task.service';
import { ModalErrorComponent } from '../modal-error/modal-error.component';

@Component({
  selector: 'reactor-room-form-addition-account-excecutive',
  templateUrl: './form-addition-account-excecutive.component.html',
  styleUrls: ['./form-addition-account-excecutive.component.scss'],
})
export class FormAdditionAccountExcecutiveComponent implements OnInit, OnChanges {
  @Input() uuidTask: string;
  @Input() cardDetailInput: ITaskDetail;
  destroy$: Subject<boolean> = new Subject<boolean>();
  ngNeat: NgNeat;
  constructor(private fb: FormBuilder, private taskService: TaskService, public toast: HotToastService, public dialog: MatDialog) {
    this.ngNeat = new NgNeat(toast);
  }
  productAmountForm = this.fb.group({
    productAmount: [''],
    uuidTask: [''],
  });
  mediaAmountForm = this.fb.group({
    mediaAmount: [''],
    uuidTask: [''],
  });

  ngOnInit(): void {
    this.productAmountForm.patchValue({
      productAmount: this.cardDetailInput.productAmount,
      uuidTask: this.uuidTask,
    });
    this.mediaAmountForm.patchValue({
      mediaAmount: this.cardDetailInput.mediaAmount,
      uuidTask: this.uuidTask,
    });
  }

  onUpdateProductAmount() {
    this.taskService
      .updateProductAmountForTask(this.productAmountForm.value)
      .pipe(this.ngNeat.hotToast(), takeUntil(this.destroy$))
      .subscribe(
        () => {},
        (err) => {
          this.openErrorDialog(err);
        },
      );
  }
  onUpdateMediaAmount() {
    this.taskService
      .updateMediaAmountForTask(this.mediaAmountForm.value)
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
    this.productAmountForm.patchValue({
      productAmount: this.cardDetailInput.productAmount,
      uuidTask: this.uuidTask,
    });
    this.mediaAmountForm.patchValue({
      mediaAmount: this.cardDetailInput.mediaAmount,
      uuidTask: this.uuidTask,
    });
  }
}
