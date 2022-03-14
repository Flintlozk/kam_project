import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { HotToastService } from '@ngneat/hot-toast';
import { ILead } from '@reactor-room/crm-models-lib';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { NgNeat } from '@reactor-room/itopplus-front-end-helpers';
import { Subject } from 'rxjs';
import { LeadService } from '../../modules/lead/service/lead.service';
import { ModalErrorComponent } from '../modal-error/modal-error.component';

@Component({
  selector: 'reactor-room-lead-table',
  templateUrl: './lead-table.component.html',
  styleUrls: ['./lead-table.component.scss'],
})
export class LeadTableComponent implements OnInit {
  @Input() activeData: MatTableDataSource<ILead>;
  @Output() clickCheckBoxCallBack = new EventEmitter<any>();
  @Output() editCallBack = new EventEmitter<ILead>();
  @Output() openTaskCallBack = new EventEmitter<ILead>();
  displayedColumns: string[] = ['Select', 'Company', 'Main_Contact', 'Phone_no', 'E_mail', 'Importor', 'Opentask'];
  ngNeat: NgNeat;
  successDialog: MatDialogRef<SuccessDialogComponent>;
  leadActiveList: ILead[];
  destroy$: Subject<boolean> = new Subject<boolean>();
  errorDialog: MatDialogRef<ModalErrorComponent>;
  selection = new SelectionModel<ILead>(true, []);
  btnDisabled = false;

  constructor(private service: LeadService, public toast: HotToastService, private dialog: MatDialog) {
    this.ngNeat = new NgNeat(toast);
  }

  ngOnInit(): void {
    this.selection.changed.subscribe(() => {
      this.btnDisabled = this.selection.hasValue();
      this.clickCheckBoxCallBack.emit(this.selection);
    });
  }

  openErrorDialog(data: { title: string; text: string }): void {
    this.errorDialog = this.dialog.open(ModalErrorComponent, {
      width: '40%',
    });

    this.errorDialog.componentInstance.data = data;
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.activeData.data.length;
    return numSelected === numRows;
  }
  masterToggle(): void {
    this.isAllSelected() ? this.selection.clear() : this.activeData.data.forEach((row) => this.selection.select(row));
  }
  onClickEdit(companyprofile: ILead): void {
    this.editCallBack.emit(companyprofile);
  }
  onClickOpenTask(companyprofile: ILead): void {
    this.openTaskCallBack.emit(companyprofile);
  }
}
