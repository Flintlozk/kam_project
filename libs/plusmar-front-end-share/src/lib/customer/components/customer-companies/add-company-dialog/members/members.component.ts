import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { PaginationComponent } from '@reactor-room/itopplus-cdk/pagination/pagination.component';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { CompanyMemeber } from '@reactor-room/itopplus-model-lib';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, pairwise, startWith } from 'rxjs/operators';
import { CustomerCompaniesService } from '../../customer-companies.service';
import { AddCompanyDialogComponent } from '../add-company-dialog.component';
import { SelectMembersComponent } from '../select-members/select-members.component';

const hasToGoToFirstPage = (prev, next) => !Object.is(prev, next) && prev.currentPage === next.currentPage && next.currentPage > 1;
@Component({
  selector: 'reactor-room-members',
  templateUrl: './members.component.html',
  styleUrls: ['./members.component.scss'],
})
export class MembersComponent implements OnInit, OnDestroy {
  @Input() dialogRef: MatDialogRef<AddCompanyDialogComponent>;
  @Input() id: number;
  @ViewChild('paginator') paginatorWidget: PaginationComponent;

  filterForm: FormGroup;
  parentForm: FormGroup;
  selectedIds: number[] = [];
  isAllchecked = false;
  tableColSpan: number;
  totalRows = 0;
  tableHeader = [
    { sort: true, title: 'Customer', key: 'last_name' },
    { sort: false, title: 'Action', key: null },
  ];
  membersTableForm = new FormArray([]);
  subscription: Subscription;
  subscription2: Subscription;

  constructor(private parentFormDirective: FormGroupDirective, public ccService: CustomerCompaniesService, private fb: FormBuilder, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.initForm();
    this.initParentForm();
    this.getMembersData();
    this.setFiltersListener();
    this.updateForm();
  }

  initParentForm(): void {
    this.parentForm = this.parentFormDirective.form;
  }

  initForm(): void {
    this.filterForm = this.fb.group({
      search: [''],
      currentPage: [1],
      pageSize: [10],
      orderBy: ['last_name'],
      orderMethod: ['desc'],
      social: this.fb.array([true, true]),
    });
  }

  reinitUpdatedMembers(): void {
    this.parentForm?.removeControl('updated_members');
    this.parentForm?.addControl('updated_members', new FormArray([]));
  }

  reinitStoredMembers(): void {
    this.parentForm?.removeControl('stored_members');
    this.parentForm?.addControl('stored_members', new FormArray([]));
  }

  updateForm(): void {
    this.subscription2 = this.ccService.companyFullInfo.subscribe((result) => {
      if (result?.members) {
        this.reinitUpdatedMembers();
        this.reinitStoredMembers();
        this.addMemberToParentForm(result?.members, 'stored');
        this.addMemberToParentForm(result?.members, 'updated');
      }
    });
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }
  setFiltersListener(): void {
    this.subscription = this.filterForm.valueChanges.pipe(startWith(''), pairwise(), debounceTime(1000), distinctUntilChanged()).subscribe(([prev, next]) => {
      if (hasToGoToFirstPage(prev, next)) this.goToFirstPage();
      this.getMembersData();
    });
  }

  sortTableData({ type }: { type: string; index: number }): void {
    this.filterForm.patchValue({ orderMethod: type });
    this.goToFirstPage();
  }

  goToFirstPage(): void {
    this.filterForm.patchValue({ currentPage: 1 });
    if (this.paginatorWidget) {
      this.paginatorWidget.paginator.pageIndex = 0;
    }
  }

  changePage($event: PageEvent): void {
    this.filterForm.patchValue({ currentPage: $event.pageIndex + 1 });
  }

  getMembersData(): void {
    this.ccService.getCompanyMembersByCompanyID(this.filterForm.value, this.id).subscribe(
      (result: CompanyMemeber[]) => {
        this.totalRows = result[0]?.totalrows;
        this.addToMembersList(result);
      },
      (err) => {
        console.log('err', err);
      },
    );
  }

  openSelectMembersDialog(): void {
    const dialogRef = this.dialog.open(SelectMembersComponent, {
      width: isMobile() ? '90%' : '50%',
      data: this.membersTableForm.value,
    });

    dialogRef.afterClosed().subscribe((result: CompanyMemeber[]) => {
      if (!result) return;

      this.reinitUpdatedMembers();

      result?.map((member: CompanyMemeber) => {
        this.addMemberToParentForm(member, 'updated');
      });

      // just show preview
      this.addToMembersList(result);
    });
  }

  removeFromParentById(id: number): void {
    const updatedValue = this.parentForm.get('updated_members')?.value;
    const updated = this.parentForm.get('updated_members') as FormArray;
    const deletedIndex = updatedValue.findIndex((member) => member.id === id);

    if (deletedIndex !== -1) {
      if (updated?.at(deletedIndex)) {
        updated?.removeAt(deletedIndex);
      }
    }
  }

  addToMembersList(newData: CompanyMemeber[]): void {
    this.membersTableForm.clear();
    newData.map((item) => this.membersTableForm.push(new FormControl(item)));
  }

  addMemberToParentForm(data: CompanyMemeber | CompanyMemeber[], field: 'stored' | 'updated'): void {
    const control = this.parentForm?.get(`${field}_members`) as FormArray;

    if (Array.isArray(data)) {
      data.map((member: CompanyMemeber) => {
        control.push(new FormControl(member));
      });
    } else {
      control.push(new FormControl(data));
    }
  }

  removeFromChildByID(id: number): void {
    const indexToRemove = this.membersTableForm?.value?.findIndex((member) => member.id === id);

    if (indexToRemove !== -1) {
      this.membersTableForm.removeAt(indexToRemove);
    }
  }

  remove(id: number): void {
    this.removeFromChildByID(id);
    this.removeFromParentById(id);
  }

  // ROWS SELECTION
  isIdSelected(dataId: number): boolean {
    return this.selectedIds.includes(dataId);
  }

  selectAllHandler(isChecked: boolean): void {
    this.selectedIds = isChecked ? this.membersTableForm.value.map((item) => item.id as number) : [];
    this.setIsAllchecked();
  }

  setIsAllchecked(): void {
    this.isAllchecked = this.membersTableForm.value.every((data, i) => this.selectedIds.includes(data.id));
  }

  addId(dataId: number): void {
    this.selectedIds.push(dataId);
  }

  removeId(dataId: number): void {
    this.selectedIds = this.selectedIds.filter((id) => id !== dataId);
  }

  selectRow(dataId: number, event): void {
    const { checked } = event.target;
    checked ? this.addId(dataId) : this.removeId(dataId);
    this.setIsAllchecked();
  }

  trackBy(index: number, el: CompanyMemeber): number {
    return el?.id;
  }
}
