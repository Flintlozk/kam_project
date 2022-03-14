import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { HotToastService } from '@ngneat/hot-toast';
import { CrudType, Department, IDealAssign, IDealDetail, IDealDetailWithTag, ITagDeal, TagOwner } from '@reactor-room/crm-models-lib';
import { getCookie, NgNeat } from '@reactor-room/itopplus-front-end-helpers';
import { IHTTPResult } from '@reactor-room/model-lib';
import { Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { TaskService } from '../../modules/task/services/task.service';
import { ITaskAssign } from '../../modules/task/task.model';
import { ModalErrorComponent } from '../modal-error/modal-error.component';

@Component({
  selector: 'reactor-room-deal-form',
  templateUrl: './deal-form.component.html',
  styleUrls: ['./deal-form.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class DealFormComponent implements OnInit {
  @Input() allAssignee: IDealAssign[];
  @Input() uuidTask: string;
  @Input() actionType: string;
  @Input() dealDetail: IDealDetailWithTag;
  @Input() uuidDeal?: string;
  @Output() formDeal = new EventEmitter<IDealDetail>();
  dealFormGroup: FormGroup;
  flagCreateDeal = false;
  ngNeat: NgNeat;

  constructor(private fb: FormBuilder, private taskServcie: TaskService, public dialog: MatDialog, public toast: HotToastService) {
    this.ngNeat = new NgNeat(toast);
  }
  get getTagDealList() {
    return this.dealCreateForm.get('tagDealList') as FormArray;
  }
  department: string;
  dealCreateForm = this.fb.group({
    dealtitle: [''],
    projectNumber: [''],
    startDate: [''],
    endDate: [''],
    advertiseBefore: false,
    paymentDetail: [''],
    productService: [''],
    objective: [''],
    target: [''],
    adsOptimizeFee: [''],
    adsSpend: [''],
    tagDealList: this.fb.array([]),
    noteDetail: [''],
    uuidTask: [''],
    accountExecutive: [''],
    projectManager: [''],
    headOfClient: [''],
  });
  destroy$: Subject<boolean> = new Subject<boolean>();
  assignOption = this.fb.control('');
  filteredAssigneeOptions: string[];
  hasProjectCode: boolean;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  tagDealListForView: ITagDeal[];
  tagDealListForOwner: ITagDeal[];
  accountExecutive: ITaskAssign;
  projectManager: ITaskAssign;
  headOfClient: ITaskAssign;
  filteredOptions: any;
  ngOnInit(): void {
    if (this.actionType === CrudType.EDIT) {
      this.dealCreateForm.patchValue(this.dealDetail);
      const cloneAllAssignee = JSON.parse(JSON.stringify(this.allAssignee));
      const AE = cloneAllAssignee.filter((assignee) => (assignee.name = this.dealDetail.accountExecutive));
      this.accountExecutive = JSON.parse(JSON.stringify(AE[0]));
      const PM = cloneAllAssignee.filter((assignee) => (assignee.name = this.dealDetail.projectManager));
      this.projectManager = JSON.parse(JSON.stringify(PM[0]));
      const HC = cloneAllAssignee.filter((assignee) => (assignee.name = this.dealDetail.headOfClient));
      this.headOfClient = JSON.parse(JSON.stringify(HC[0]));
      this.dealCreateForm.removeControl('uuidTask');
      this.dealCreateForm.addControl('uuidDeal', this.fb.control(this.uuidDeal));
    }
    this.taskServcie
      .getTagDealByOwner()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (tagDealList) => {
          this.tagDealListForOwner = tagDealList;
          if (this.actionType === CrudType.EDIT) {
            const tagDealListNumber = this.dealDetail.tagDealList.map((tag) => tag.tagDealId);
            tagDealListNumber.forEach((tag) => {
              const tagDeal = this.tagDealListForOwner.filter((TagByOwner) => TagByOwner.tagDealId === tag);
              this.tagDealListForView.push(tagDeal[0]);
              this.getTagDealList.push(this.fb.control(tag));
            });
          }
        },
        (err) => {
          this.openErrorDialog(err);
        },
      );
    this.tagDealListForView = [];
    this.dealCreateForm.patchValue({
      uuidTask: this.uuidTask,
    });
    this.filteredAssigneeOptions = this.allAssignee.map((assigneeDetail) => assigneeDetail.name);
    this.filteredOptions = this.assignOption.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterAssignType(value)),
    );
  }
  private _filterAssignType(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.filteredAssigneeOptions.filter((option) => option.toLowerCase().includes(filterValue));
  }

  onClickCreateDeal(): void {
    this.taskServcie
      .insertDealDetailByTask(this.dealCreateForm.value)
      .pipe(this.ngNeat.hotToast(), takeUntil(this.destroy$))
      .subscribe(
        (response: IHTTPResult) => {
          const dealDetail = this.dealCreateForm.value;
          dealDetail['uuidDeal'] = response.value;
          dealDetail['profilePic'] = getCookie('profile_pic_url');
          dealDetail['name'] = getCookie('name');
          this.formDeal.emit(this.dealCreateForm.value);
        },
        (err) => {
          this.openErrorDialog(err);
        },
      );
  }
  onClickUpdateDeal(): void {
    this.taskServcie
      .updateDealDetailByUuidDeal(this.dealCreateForm.value)
      .pipe(this.ngNeat.hotToast(), takeUntil(this.destroy$))
      .subscribe(
        () => {},
        (err) => {
          this.openErrorDialog(err);
        },
      );
  }
  trackByIndex(index: number): number {
    return index;
  }
  onClickTagDeal(tag: ITagDeal) {
    if (!this.tagDealListForView.includes(tag)) {
      this.tagDealListForView.push(tag);
      this.getTagDealList.push(this.fb.control(tag.tagDealId));
    }
  }
  onClickRemoveDealTag(tag: ITagDeal, index: number) {
    this.tagDealListForView = this.tagDealListForView.filter((tagView) => tagView !== tag);
    this.getTagDealList.removeAt(index);
  }
  onClickAE() {
    this.department = Department.ACCOUNT_EXCECUTIVE;
  }
  onClickPM() {
    this.department = Department.PROJECT_MANAGER;
  }
  onClickHC() {
    this.department = Department.HEAD_OF_CLIENT;
  }

  onAddAssigneeWithAutoComplete(name: string): void {
    if (this.department === Department.ACCOUNT_EXCECUTIVE) {
      this.dealCreateForm.patchValue({
        accountExecutive: name,
      });
      const assigneeData = this.allAssignee.filter((assignee) => (assignee.name = name));
      this.accountExecutive = JSON.parse(JSON.stringify(assigneeData[0]));
      this.assignOption.patchValue('');
    } else if (this.department === Department.PROJECT_MANAGER) {
      this.dealCreateForm.patchValue({
        projectManager: name,
      });
      const assigneeData = this.allAssignee.filter((assignee) => (assignee.name = name));
      this.projectManager = JSON.parse(JSON.stringify(assigneeData[0]));
      this.assignOption.patchValue('');
    } else if (this.department === Department.HEAD_OF_CLIENT) {
      this.dealCreateForm.patchValue({
        headOfClient: name,
      });
      const assigneeData = this.allAssignee.filter((assignee) => (assignee.name = name));
      this.headOfClient = JSON.parse(JSON.stringify(assigneeData[0]));
      this.assignOption.patchValue('');
    }
  }
  openErrorDialog(err: string): void {
    this.dialog.open(ModalErrorComponent, {
      data: {
        text: err,
      },
    });
  }
}
