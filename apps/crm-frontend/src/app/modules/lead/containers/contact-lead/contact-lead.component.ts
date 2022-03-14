import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';

import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { ModalErrorComponent } from '../../../../components/modal-error/modal-error.component';
import { ITaskDetail } from '../../../task/task.model';
import { LeadService } from '../../service/lead.service';
import { takeUntil } from 'rxjs/operators';
import { isEmpty } from 'lodash';
import { Action, CrudType, IHTTPResult, ILead, IPaginationPage, TYPEFORM } from '@reactor-room/crm-models-lib';
import { HotToastService } from '@ngneat/hot-toast';
import { isMobile, NgNeat } from '@reactor-room/itopplus-front-end-helpers';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { ModalConfirmDeleteComponent } from '../../../../components/modal-confirm-delete/modal-confirm-delete.component';
@Component({
  selector: 'reactor-room-contact-lead',
  templateUrl: './contact-lead.component.html',
  styleUrls: ['./contact-lead.component.scss'],
})
export class ContactLeadComponent implements OnInit, OnDestroy {
  public index: number;
  public userRef: ILead;
  public typeOfAction: string;
  public id: number;
  public leadActiveList: ILead[];
  public leadInActiveList: ILead[];
  public activeDataSource: MatTableDataSource<ILead>;
  public inActiveDataSource: MatTableDataSource<ILead>;
  numberOfActiveLead: number;
  numberOfInActiveLead: number;
  errorDialog: MatDialogRef<ModalErrorComponent>;
  TYPEFORM = TYPEFORM.Lead;
  cardDetail: ITaskDetail;
  successDialog: any;
  @ViewChild('sidebar', { static: true }) sidenav: MatSidenav;
  destroy$: Subject<boolean> = new Subject<boolean>();
  crudType = CrudType.ADD;
  PaginationPage: IPaginationPage;
  ngNeat: NgNeat;
  btnDisabled = true;
  selection = new SelectionModel<ILead>(true, []);
  constructor(private service: LeadService, private dialog: MatDialog, public translate: TranslateService, public toast: HotToastService) {
    translate.setDefaultLang('en');
    this.ngNeat = new NgNeat(toast);
  }

  ngOnInit(): void {
    this.PaginationPage = {
      skip_number: 0,
      limit_number: 3,
    };
    this.leadActiveList = [];
    this.leadInActiveList = [];
    this.activeDataSource = new MatTableDataSource(this.leadActiveList);
    this.inActiveDataSource = new MatTableDataSource(this.leadInActiveList);
    this.getTotalLead();
    this.getLeadContact(this.PaginationPage);
    this.getInActiveLeadContact(this.PaginationPage);
  }
  getTotalLead() {
    this.service
      .getTotalLead()
      .pipe(takeUntil(this.destroy$))
      .subscribe((numberOfLead) => {
        if (numberOfLead) {
          this.numberOfActiveLead = numberOfLead.activeLead;
          this.numberOfInActiveLead = numberOfLead.inActiveLead;
        }
      });
  }
  getLeadContact(pagination) {
    this.service
      .getLeadsContact(pagination)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (leadList) => {
          if (leadList) {
            this.leadActiveList = leadList;
            this.leadActiveList = JSON.parse(JSON.stringify(this.leadActiveList));
            this.activeDataSource.data = this.leadActiveList;
          }
        },
        (error) => this.openErrorDialog({ text: error, title: 'Cannot get LeadContact' }),
      );
  }
  getInActiveLeadContact(pagination) {
    this.service
      .getInActiveLeadsContact(pagination)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (leadList) => {
          if (leadList) {
            this.leadInActiveList = leadList;
            this.inActiveDataSource.data = this.leadInActiveList;
          }
        },
        (error) => this.openErrorDialog({ text: error, title: 'Cannot get LeadContact' }),
      );
  }

  onOpenTaskCallBack(companyprofile): void {
    this.TYPEFORM = TYPEFORM.Task;
    this.typeOfAction = CrudType.ADD;
    this.service
      .getTaskDetailForOpenTask(companyprofile.uuidCompany)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (leadList) => {
          if (leadList) {
            this.cardDetail = leadList[0];
            void this.sidenav.toggle();
          }
        },
        (error) => this.openErrorDialog({ text: error, title: 'Cannot get Lead information' }),
      );
  }

  onEditCallBack(companyprofile: ILead): void {
    this.TYPEFORM = TYPEFORM.Lead;
    this.typeOfAction = CrudType.EDIT;
    this.userRef = companyprofile;
    void this.sidenav.toggle();
  }
  deleteLeadContact(): void {
    const companyProfileList = this.selection.selected;
    this.service
      .deleteCompanyContact(companyProfileList)
      .pipe(this.ngNeat.hotToast(), takeUntil(this.destroy$))
      .subscribe(
        (serverResponse: IHTTPResult) => {
          if (serverResponse.status === 200) {
            this.openSuccessDialog({ text: 'Lead successfully removed', title: 'Remove Lead' });
            companyProfileList.forEach((companyprofile) => {
              this.leadActiveList = this.leadActiveList.filter((lead) => lead.uuidCompany !== companyprofile.uuidCompany);
            });
          }
          this.getTotalLead();
          this.PaginationPage = {
            skip_number: 0,
            limit_number: 3,
          };
          this.getLeadContact(this.PaginationPage);

          this.btnDisabled = true;
          this.selection.clear();
        },
        (err) => {
          this.openErrorDialog({ text: err, title: 'Cannot delete lead contact' });
        },
      );
  }
  importLeadCallBack(importlead: ILead): void {
    if (this.typeOfAction === CrudType.ADD) {
      if (isEmpty(this.leadActiveList)) {
        this.leadActiveList = [];
        this.activeDataSource.data = [];
      }
      this.getTotalLead();
      this.PaginationPage = {
        skip_number: 0,
        limit_number: 3,
      };
      this.getLeadContact(this.PaginationPage);
    } else if (this.typeOfAction === CrudType.EDIT) {
      this.index = this.leadActiveList.findIndex((lead) => lead.uuidCompany === importlead.uuidCompany);
      this.leadActiveList[this.index].companyname = importlead.companyname;
      this.leadActiveList[this.index].primaryContactList = importlead.companyContactList;
      this.activeDataSource.data = this.leadActiveList;
    }
  }
  openTaskCallBack(): void {
    this.getTotalLead();
    this.getLeadContact(this.PaginationPage);
    this.getInActiveLeadContact(this.PaginationPage);
  }
  onClickImportLead(): void {
    this.TYPEFORM = TYPEFORM.Lead;
    this.typeOfAction = CrudType.ADD;
    this.userRef = {
      uuidCompany: '',
      companyname: '',
      companyContactList: [
        {
          name: '',
          phoneNumber: '',
          email: '',
        },
      ],
    } as ILead;
    void this.sidenav.toggle();
  }

  trackIndex(index: number, item: ILead): number {
    return index;
  }

  openErrorDialog(data: { title: string; text: string }): void {
    this.errorDialog = this.dialog.open(ModalErrorComponent, {
      width: isMobile() ? '90%' : '40%',
    });

    this.errorDialog.componentInstance.data = data;
  }

  applyFilter(filterValue: string): void {
    this.activeDataSource.filter = filterValue.trim().toLowerCase();
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
  openSuccessDialog(data: { text: string; title: string }): void {
    this.successDialog = this.dialog.open(SuccessDialogComponent, { width: isMobile() ? '90%' : '50%' });

    this.successDialog.componentInstance.data = data;
  }
  onCheckCallBack(selector) {
    this.selection = selector;
    this.btnDisabled = !this.selection.hasValue();
  }
  onClickChangePaginationActiveLead(event) {
    this.PaginationPage.skip_number = event.pageIndex * event.pageSize;
    this.PaginationPage.limit_number = event.pageSize;
    this.getLeadContact(this.PaginationPage);
  }
  onClickChangePaginationInActiveLead(event) {
    this.PaginationPage.skip_number = event.pageIndex * event.pageSize;
    this.PaginationPage.limit_number = event.pageSize;
    this.getInActiveLeadContact(this.PaginationPage);
  }
  onClickDelete() {
    const dialogRef = this.dialog.open(ModalConfirmDeleteComponent, {
      data: {
        title: 'Lead',
      },
    });
    dialogRef.afterClosed().subscribe((actionDialog) => {
      if (actionDialog === Action.CONFIRM) {
        this.deleteLeadContact();
      }
    });
  }
}
