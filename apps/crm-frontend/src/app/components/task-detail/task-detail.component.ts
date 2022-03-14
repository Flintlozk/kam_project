import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Form, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatMenuTrigger } from '@angular/material/menu';
import { interval, Subject } from 'rxjs';
import {
  IAppointmentTask,
  ITaskDetail,
  ITagTask,
  IInsertTagInput,
  IInsertAppointInput,
  INoteTask,
  ITaskAssign,
  ITaskDealList,
  ITaskDealInsertInput,
  ContactCompany,
  ICompanyContactInsert,
  ICompanyContactUpdate,
  IEditAppointInput,
  ManageCommentForm,
} from '../../modules/task/task.model';
import { TaskService } from '../../modules/task/services/task.service';
import { ModalErrorComponent } from '../modal-error/modal-error.component';
import { MatDialog } from '@angular/material/dialog';
import { debounce, map, startWith, takeUntil, tap } from 'rxjs/operators';
import { Action, CrudType, ICrmFlowName, IProjectCode } from '@reactor-room/crm-models-lib';
import { getCookie, getTimestamp, getUTCDateFromString, NgNeat } from '@reactor-room/itopplus-front-end-helpers';
import { HotToastService } from '@ngneat/hot-toast';
import { IHTTPResult } from '@reactor-room/model-lib';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { ModalConfirmDeleteComponent } from '../modal-confirm-delete/modal-confirm-delete.component';
import { FormCreateDealComponent } from '../form-create-deal/form-create-deal.component';
import { Observable } from '@apollo/client/utilities';
@Component({
  selector: 'reactor-room-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss'],
})
export class TaskDetailComponent implements OnInit, OnChanges, OnDestroy {
  @Input() cardDetailInput: ITaskDetail;
  @Input() taskDepartment: string;
  @Input() tagTask: ITagTask[];
  @Input() typeOfAction: CrudType;
  @Input() sidebar: MatSidenav;
  @Input() disableEditContact: boolean;
  @Output() inActiveTask = new EventEmitter<string>();
  @Output() openTask = new EventEmitter();
  @Output() addAssignInCard = new EventEmitter<ITaskAssign[]>();
  @Output() changeTitle = new EventEmitter<string>();
  @Output() addTag = new EventEmitter<ITagTask[]>();
  @ViewChild(MatMenuTrigger) addAssign: MatMenuTrigger;
  @ViewChild('commentTask') commentTask: ElementRef;
  indexNote: number;
  type: string;
  taskDetailForm: FormGroup;
  createDate: string;
  displayDatePicker = false;
  taskOwner: ICompanyContactUpdate[] = [];
  groupAssignee: ITaskAssign[] = [];
  allAssignee: ITaskAssign[] = [];
  noteTask: INoteTask[] = [];
  appointmentTask: IAppointmentTask[] = [];
  taskTitle = '';
  companyName: string;
  createTaskForm: FormGroup;
  formDeal: FormGroup;
  formAppoint: FormGroup;
  formTask: FormGroup;
  taskDealList: ITaskDealList[];
  fileData: File;
  fileDataList: File[];
  fileDataListAll: File[];
  nextState: string;
  editMode = false;
  insertContactMode = false;
  modeText = ContactCompany.READONLY;
  updateMode = true;
  tooltipAddContactCompany = ContactCompany.TOOLTIP_ADD;
  myProfilePic: string;
  myName: string;
  contactTaskIndex = 0;
  contactTaskIdInsert: number;
  destroy$: Subject<boolean> = new Subject<boolean>();
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  ngNeat: NgNeat;
  workflow: FormControl;
  userWorkflow: ICrmFlowName[];
  commentList: FormArray;
  showInputComment: boolean;
  primaryDisplayNote = ManageCommentForm.PRIMARY_DISPLAY_NOTE;
  isInternalNote: boolean;
  uuidTask: string;
  commentFormGroup = this.fb.group({ commentNote: this.fb.array([]) });
  animal: string;
  name: string;
  optionsWithUuid: IProjectCode[];
  projectCode: FormControl;
  filteredDealOptions;
  options: string[];
  test;
  get getAllAssigneeList() {
    return this.createTaskForm.get('allAssignee') as FormArray;
  }
  get getAppointmentTaskList() {
    return this.createTaskForm.get('appointmentTask') as FormArray;
  }
  get getNoteTaskList() {
    return this.createTaskForm.get('noteTask') as FormArray;
  }
  get getCompanyContacDetail() {
    return this.formTask.get('formContactDetail') as FormGroup;
  }
  get getCommentList() {
    return this.commentFormGroup.get('commentNote') as FormArray;
  }
  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    public dialog: MatDialog,
    public toast: HotToastService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.formDeal = new FormGroup({});
    this.formTask = new FormGroup({});
    this.formAppoint = new FormGroup({});
    this.ngNeat = new NgNeat(toast);
    this.projectCode = this.fb.control('');
  }

  ngOnInit(): void {
    this.projectCode.valueChanges
      .pipe(
        startWith(''),
        debounce(() => interval(1000)),
      )
      .subscribe((value) => this._filter(value));

    this.fileDataListAll = [];
    this.myProfilePic = getCookie('profile_pic_url');
    this.myName = getCookie('name');
    this.fileDataList = [];
    this.workflow = new FormControl('');
    this.createTaskForm = this.fb.group({
      title: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      uuidCompany: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
      allAssignee: this.fb.array([]),
      appointmentTask: this.fb.array([]),
      noteTask: this.fb.array([]),
      workflow: '',
    });
    this.cardDetailInput = {
      id: 1,
      title: '',
      uuidTask: '',
      uuidCompany: '',
      owner: 'First Owner',
      tagname: ['firsttag', 'secondtag'],
      detail: 'test',
      email: 'First@email',
      phoneNumber: '09999996699',
      companyname: '',
      name: 'BBB',
      appointmentTask: this.appointmentTask,
      statusType: 'todo',
      companyId: 1,
      userWorkflow: [],
    };
    this.taskDetailForm = this.createDetailFormGroup();
  }
  private _filter(value: string) {
    const filterValue = value ? value.toLowerCase() : '';
    const getProjectCode = { filter: filterValue, uuidTask: this.uuidTask };
    if (this.uuidTask) {
      this.taskService.getProjectCodeOfDeal(getProjectCode).subscribe((result) => {
        this.optionsWithUuid = result;
        this.options = result.map((deal) => deal.projectCode);
        this.filteredDealOptions = this.options.filter((option) => option.toLowerCase().includes(filterValue));
      });
    }
  }

  createDetailFormGroup(): FormGroup {
    return this.fb.group({
      dateAppointment: [new Date()],
    });
  }

  createAssigneeFormGroup(): FormGroup {
    return this.fb.group({
      name: [''],
    });
  }
  createAppointmentFormGrop(): FormGroup {
    return this.fb.group({
      appointmentDate: [''],
      appointmentNote: ['Note'],
    });
  }
  createNoteTaskFormGrop(): FormGroup {
    return this.fb.group({
      noteDetail: [''],
      attachmentsIndex: [],
    });
  }
  createAssigneeInTaskForm(): void {
    this.getAllAssigneeList.push(this.createAssigneeFormGroup());
  }
  createAppointmentInTaskForm(): void {
    this.getAppointmentTaskList.push(this.createAppointmentFormGrop());
  }
  createNoteTaskInTaskForm(): void {
    this.getNoteTaskList.push(this.createNoteTaskFormGrop());
  }
  onAppointment(): void {
    this.displayDatePicker = !this.displayDatePicker;
  }
  onAddAppointment(appointmentForm: FormGroup): void {
    const message: IInsertAppointInput = {
      appointmentStartDate: getUTCDateFromString(appointmentForm.value.startDateControl.toLocaleString()),
      appointmentEndDate: getUTCDateFromString(appointmentForm.value.endDateControl.toLocaleString()),
      appointmentNote: appointmentForm.value.appointmentNote,
      companyName: this.companyName,
      uuidTask: this.cardDetailInput.uuidTask,
      href: this.router.url,
    };
    if (this.typeOfAction === CrudType.EDIT) {
      this.taskService
        .insertAppointment(message)
        .pipe(this.ngNeat.hotToast(), takeUntil(this.destroy$))
        .subscribe(
          (result: IHTTPResult) => {
            const resultString = result.value;
            const resultList = resultString.split(' ');
            this.appointmentTask.push({
              appointmentStartDate: getUTCDateFromString(appointmentForm.value.startDateControl.toLocaleString()),
              appointmentEndDate: getUTCDateFromString(appointmentForm.value.endDateControl.toLocaleString()),
              profilePic: this.myProfilePic,
              createBy: this.myName,
              note: appointmentForm.value.appointmentNote,
              htmlLink: resultList[0],
              uuidAppointment: resultList[1],
            });
          },
          (err) => {
            this.openErrorDialog(err);
          },
        );
    }
    this.displayDatePicker = false;
    if (this.typeOfAction === CrudType.ADD) {
      this.appointmentTask.push({
        appointmentStartDate: appointmentForm.value.startDateControl.toLocaleString(),
        appointmentEndDate: appointmentForm.value.endDateControl.toLocaleString(),
        note: 'Note',
        profilePic: this.myProfilePic,
        createBy: this.myName,
        htmlLink: '',
        uuidAppointment: '',
      });
      this.createAppointmentInTaskForm();
      this.getAppointmentTaskList.patchValue(this.appointmentTask);
    }
  }
  onDeleteAppointmentTask(appointment): void {
    this.taskService
      .deleteAppointmentTask(appointment.uuidAppointment)
      .pipe(this.ngNeat.hotToast(), takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.appointmentTask = this.appointmentTask.filter((appointmentView) => appointmentView !== appointment);
        },
        (err) => {
          this.openErrorDialog(err);
        },
      );
  }
  onEditAppointment(appointmentForm: FormGroup) {
    const message: IEditAppointInput = {
      appointmentStartDate: getUTCDateFromString(appointmentForm.value.startDateControl.toLocaleString()),
      appointmentEndDate: getUTCDateFromString(appointmentForm.value.endDateControl.toLocaleString()),
      appointmentNote: appointmentForm.value.appointmentNote,
      companyName: this.companyName,
      uuidTask: this.cardDetailInput.uuidTask,
      href: this.router.url,
      uuidAppointment: appointmentForm.value.uuidAppointment,
    };
    this.taskService
      .editAppointment(message)
      .pipe(this.ngNeat.hotToast(), takeUntil(this.destroy$))
      .subscribe(
        () => {},
        (err) => {
          this.openErrorDialog(err);
        },
      );
  }
  onAddAssignee(nameAssignee: string): void {
    if (this.typeOfAction === CrudType.EDIT) {
      this.taskService
        .insertAssignTask({ uuidTask: this.cardDetailInput.uuidTask, value: nameAssignee })
        .pipe(this.ngNeat.hotToast(), takeUntil(this.destroy$))
        .subscribe({
          error: (err) => {
            this.openErrorDialog(err);
          },
          complete: () => {},
        });
    }
    this.addAssign.closeMenu();
    const assignee = this.cardDetailInput.getAllUser.filter((user) => user.name === nameAssignee);
    this.groupAssignee.push(assignee[0]);
    this.addAssigneeCallBack(this.groupAssignee);
    this.createAssigneeInTaskForm();
    this.getAllAssigneeList.patchValue(this.groupAssignee);
  }
  onChangeOwnerDetail(index: number): void {
    this.contactTaskIndex = index;
    if (index !== 0) {
      this.taskOwner[index].primaryContact = false;
    } else {
      this.taskOwner[index].primaryContact = true;
    }
    this.formTask.get('formContactDetail').patchValue(this.taskOwner[index]);
    this.updateMode = true;
  }
  onCancelInsertContactTask() {
    this.editMode = false;
    this.modeText = ContactCompany.READONLY;
    if (this.cardDetailInput.contactTask) {
      this.formTask.get('formContactDetail').patchValue(this.cardDetailInput.contactTask[0]);
    }
  }
  onAddContactTask() {
    this.insertContactMode = true;
    this.updateMode = false;
    this.getCompanyContacDetail.controls['name'].patchValue('');
    this.getCompanyContacDetail.controls['email'].patchValue('');
    this.getCompanyContacDetail.controls['phoneNumber'].patchValue('');
    this.getCompanyContacDetail.controls['lineId'].patchValue('');
    this.getCompanyContacDetail.controls['position'].patchValue('');
    this.getCompanyContacDetail.controls['primaryContact'].patchValue(false);
  }
  onInsertCompanyContact() {
    const insertCompanyContactDetail: ICompanyContactInsert = {
      name: this.getCompanyContacDetail.controls['name'].value,
      email: this.getCompanyContacDetail.controls['email'].value,
      phoneNumber: this.getCompanyContacDetail.controls['phoneNumber'].value,
      lineId: this.getCompanyContacDetail.controls['lineId'].value,
      position: this.getCompanyContacDetail.controls['position'].value,
      companyId: this.cardDetailInput.companyId,
    };

    this.taskService
      .insertCompanyContactTask(insertCompanyContactDetail)
      .pipe(this.ngNeat.hotToast(), takeUntil(this.destroy$))
      .subscribe(
        (insertResult: IHTTPResult) => {
          this.contactTaskIdInsert = insertResult.value;
          this.taskOwner.push({ ...insertCompanyContactDetail, contactCompanyId: this.contactTaskIdInsert });
          this.contactTaskIndex = this.taskOwner.length - 1;
        },
        (err) => {
          this.openErrorDialog(err);
        },
      );
  }
  onPreUpdateCompanyDetail() {
    if (this.getCompanyContacDetail.controls['primaryContact'].value) {
      const contactPerson = this.taskOwner.filter((contactPersons) => {
        return contactPersons.primaryContact === true;
      });
      if (contactPerson.length > 0 && contactPerson[0] !== this.taskOwner[0]) {
        delete contactPerson[0]['__typename'];
        this.taskService.updateCompanyContact({ ...contactPerson[0], primaryContact: false }).subscribe((x) => {
          this.taskOwner[0].primaryContact = false;
        });
      }
    }
    this.updateCompanyDetail();
  }
  updateCompanyDetail() {
    let contactId;
    try {
      contactId = this.cardDetailInput.contactTask[this.contactTaskIndex].contactCompanyId;
    } catch {
      contactId = this.contactTaskIdInsert;
    }
    const message = {
      name: this.getCompanyContacDetail.controls['name'].value,
      email: this.getCompanyContacDetail.controls['email'].value,
      phoneNumber: this.getCompanyContacDetail.controls['phoneNumber'].value,
      companyId: this.cardDetailInput.companyId,
      contactCompanyId: parseInt(contactId, 10),
      primaryContact: this.getCompanyContacDetail.controls['primaryContact'].value,
      lineId: this.getCompanyContacDetail.controls['lineId'].value,
      position: this.getCompanyContacDetail.controls['position'].value,
    };
    this.taskService
      .updateCompanyContact(message)
      .pipe(this.ngNeat.hotToast(), takeUntil(this.destroy$))
      .subscribe({
        error: (err) => {
          this.openErrorDialog(err);
        },
        complete: () => {
          this.taskOwner[this.contactTaskIndex] = message;
        },
      });
  }
  onDeleteTag(tagId: number) {
    this.taskService
      .deleteTagTask(tagId)
      .pipe(this.ngNeat.hotToast(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.tagTask = this.tagTask.filter((item) => {
          return item.tagId !== tagId;
        });
        this.addTag.emit(this.tagTask);
      });
  }
  onUpdateCommentTask(index: number): void {
    this.getCommentList.disable();
    const updateNote = {
      noteDetail: this.getCommentList.controls[index].value,
      uuidNote: this.noteTask[index].uuidNote,
      flowId: parseInt(this.taskDepartment, 10),
    };
    this.taskService
      .updateNoteTask(updateNote)
      .pipe(this.ngNeat.hotToast(), takeUntil(this.destroy$))
      .subscribe(
        () => {},
        (err) => {
          this.openErrorDialog(err);
        },
      );
  }
  onRemoveAttachment(uuidAttachment: string) {
    this.taskService
      .deleteAttachment(uuidAttachment)
      .pipe(this.ngNeat.hotToast(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.noteTask.forEach((element) => {
          element.attachments = element.attachments.filter((attachment) => attachment.uuidAttachment !== uuidAttachment);
        });
      });
  }
  onAddCommentTask(textNote): void {
    this.showInputComment = false;
    this.getCommentList.disable();
    const addNote: INoteTask = {
      noteDetail: textNote.value,
      createDate: getTimestamp(),
      createBy: this.myName,
      profilePic: this.myProfilePic,
      attachments: [],
      attachmentsIndex: [],
      isInternalNote: this.isInternalNote,
      uuidNote: '',
      flowId: parseInt(this.taskDepartment, 10),
      uuidTask: this.uuidTask,
    };
    if (this.typeOfAction === CrudType.EDIT) {
      const message = { uuidTask: this.cardDetailInput.uuidTask, noteDetail: textNote.value, isInternalNote: this.isInternalNote, flowId: parseInt(this.taskDepartment, 10) };
      this.taskService
        .insertNoteTask(this.fileDataList, message)
        .pipe(this.ngNeat.hotToast(), takeUntil(this.destroy$))
        .subscribe(
          (insertNote) => {
            let i = 0;
            for (i = 0; i < this.fileDataList.length; i++) {
              const result = insertNote[i].value.split(' ');
              addNote.attachments.push({ attachmentName: this.fileDataList[i].name, attachmentLink: result[0], uuidAttachment: result[1] });
            }
            addNote.uuidNote = insertNote[i].value;
            this.noteTask.push(addNote);
            this.getCommentList.push(this.fb.control({ value: textNote.value, disabled: true }));
            textNote.value = '';
            this.fileDataList = [];
          },
          (err) => {
            this.openErrorDialog(err);
          },
        );
    } else if (this.typeOfAction === CrudType.ADD) {
      this.fileDataList.forEach((file) => {
        const index = this.fileDataListAll.indexOf(file);
        addNote.attachmentsIndex.push(index);
        addNote.attachments.push({ attachmentName: file.name, attachmentLink: 'none', uuidAttachment: '' });
      });
      this.fileDataList = [];
      this.noteTask.push(addNote);
      this.createNoteTaskInTaskForm();
      this.getNoteTaskList.patchValue(this.noteTask);
      textNote.value = '';
    }
  }
  onDeleteTask() {
    this.taskService.updateActiveTask({ uuidTask: this.cardDetailInput.uuidTask, uuidState: this.cardDetailInput.uuidState, activeTask: false }).subscribe(
      () => {
        this.inActiveTask.emit(this.cardDetailInput.uuidTask);
      },
      (err) => {
        this.openErrorDialog(err);
      },
    );
  }
  onAddTaskTag(event: MatChipInputEvent): void {
    const message: IInsertTagInput = { tagName: event.value, uuidTask: this.cardDetailInput.uuidTask };
    this.taskService
      .insertTag(message)
      .pipe(this.ngNeat.hotToast(), takeUntil(this.destroy$))
      .subscribe(
        (newTagId: IHTTPResult) => {
          this.tagTask.push({ tagname: event.value, color: '', tagId: parseInt(newTagId.value, 10) });
          this.addTagCallBack(this.tagTask);
        },
        (err) => {
          this.openErrorDialog(err);
        },
      );

    const input = event.input;
    const value = event.value;
    if ((value || '').trim()) {
      this.tagTask = Object.assign([], this.tagTask);
    }
    if (input) {
      input.value = '';
    }
  }
  onChangeEdit() {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.modeText = ContactCompany.EDIT_MODE;
    } else this.modeText = ContactCompany.READONLY;
  }
  trackByIndex(index: number): number {
    return index;
  }
  trackByContact(index: number, owner): number {
    return owner.contactCompanyId;
  }
  onUploadFileAttach(event): void {
    this.fileData = <File>event.target.files[0];
    this.fileDataList.push(this.fileData);
    this.fileDataListAll.push(this.fileData);
  }

  onUpdateTaskTitle(taskTitle): void {
    if (this.typeOfAction === CrudType.EDIT) {
      this.taskService
        .updateTaskTitle({ title: taskTitle.value, uuidTask: this.cardDetailInput.uuidTask })
        .pipe(this.ngNeat.hotToast(), takeUntil(this.destroy$))
        .subscribe(
          () => {
            this.changeTitleCallBack(taskTitle.value);
          },
          (err) => {
            this.openErrorDialog(err);
          },
        );
    }
    if (this.typeOfAction === CrudType.ADD) {
      this.taskTitle = taskTitle.value;
    }
  }
  openErrorDialog(err: string): void {
    this.dialog.open(ModalErrorComponent, {
      data: {
        text: err,
      },
    });
  }
  getShortName(fullName: string): string {
    if (fullName === '') return 'New';
    if (fullName.split(' ').length > 1) {
      return fullName
        .toUpperCase()
        .split(' ')
        .map((n) => n[0])
        .join('');
    } else {
      return fullName.toUpperCase().substring(0, 2);
    }
  }
  onRemoveFileAttach(index: number): void {
    this.fileDataList.splice(index, 1);
  }
  ngOnChanges(changes: SimpleChanges): void {
    this._filter('');
    if (!this.formTask.get('formContactDetail')) {
      this.ngOnInit();
    }
    if (this.typeOfAction === CrudType.ADD) {
      if (this.cardDetailInput.userWorkflow[0]) {
        this.userWorkflow = this.cardDetailInput.userWorkflow;
        this.workflow.patchValue(this.userWorkflow[0].flowname);
      }
    }

    this.taskOwner = [];
    this.noteTask = [];
    this.appointmentTask = [];
    this.taskDealList = [];
    if (this.cardDetailInput.uuidTask) {
      this.uuidTask = this.cardDetailInput.uuidTask;
    }
    if (this.cardDetailInput.title) {
      this.taskTitle = this.cardDetailInput.title;
    }
    this.companyName = this.cardDetailInput.companyname;
    if (this.cardDetailInput.taskDeal) {
      this.cardDetailInput.taskDeal.forEach((taskDeal) => {
        this.taskDealList.push(taskDeal);
      });
    }
    if (!this.cardDetailInput.createDate) {
      this.cardDetailInput.createDate = new Date();
    }
    if (this.cardDetailInput.nextStateTask) {
      this.nextState = this.cardDetailInput.nextStateTask.statename;
    }

    if (this.cardDetailInput.contactTask) {
      this.formTask.get('formContactDetail').patchValue(this.cardDetailInput.contactTask[0]);
    }

    if (this.cardDetailInput.companyAddress) {
      this.formTask.get('formCompanyAddress').patchValue(this.cardDetailInput.companyAddress[0]);
    }
    if (this.cardDetailInput.assignee) {
      this.groupAssignee = JSON.parse(JSON.stringify(this.cardDetailInput.assignee));
    }
    if (this.cardDetailInput.getAllUser) {
      this.allAssignee = this.cardDetailInput.getAllUser;
    }

    if (this.cardDetailInput.noteTask) {
      this.noteTask = JSON.parse(JSON.stringify(this.cardDetailInput.noteTask));
      for (const note of this.noteTask) {
        note.createDate = getUTCDateFromString(note.createDate);
      }
    }
    if (this.cardDetailInput.contactTask) {
      this.taskOwner = JSON.parse(JSON.stringify(this.cardDetailInput.contactTask));
    }
    if (this.cardDetailInput.appointmentTask) {
      this.appointmentTask = JSON.parse(JSON.stringify(this.cardDetailInput.appointmentTask));
    }
    this.showInputComment = false;
    this.getCommentList.clear();
    this.noteTask.forEach(() => this.getCommentList.push(this.fb.control({ value: '', disabled: true })));
    const noteDetail = this.noteTask.map((element) => element.noteDetail);
    this.getCommentList.setValue(noteDetail);
  }
  onConfirmCreateTaskDeal(): void {
    const insertTaskDealByTaskInput: ITaskDealInsertInput = this.formDeal.value['dealFormGroup'];
    insertTaskDealByTaskInput.uuidTask = this.cardDetailInput.uuidTask;

    this.taskService
      .insertTaskDealByTask(insertTaskDealByTaskInput)
      .pipe(this.ngNeat.hotToast(), takeUntil(this.destroy$))
      .subscribe({
        error: (err) => {
          this.openErrorDialog(err);
        },
        complete: () => {
          this.taskDealList.push(this.formDeal.value['dealFormGroup']);
        },
      });
  }
  onClickMove(): void {
    const message = {
      uuidTask: this.cardDetailInput.uuidTask,
      previousStatusType: this.cardDetailInput.uuidState,
      uuidState: this.cardDetailInput.nextStateTask.uuidState,
      updateCross: false,
    };
    this.taskService.updateTaskById(message).subscribe({
      error: (err) => {
        this.openErrorDialog(err);
      },
      complete: () => {},
    });
  }

  onClickSave(): void {
    this.createTaskForm.patchValue({
      title: this.taskTitle,
      uuidCompany: this.cardDetailInput.uuidCompany,
    });
    this.getNoteTaskList.patchValue(this.noteTask);
    this.createTaskForm.patchValue({
      workflow: this.workflow.value,
    });
    this.taskService
      .insertTaskByLead(this.fileDataListAll, this.createTaskForm.value)
      .pipe(this.ngNeat.hotToast(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.openTaskCallBack();
      });
    void this.sidebar.toggle();
  }
  onClickInternalNote() {
    this.isInternalNote = true;
    this.showInputComment = true;
  }
  onClickSharingNote() {
    this.isInternalNote = false;
    this.showInputComment = true;
  }

  undoToSelectNote() {
    this.showInputComment = false;
  }

  onClickEditComment(index: number) {
    if (this.getCommentList.controls[index].valid) {
      this.getCommentList.disable();
    } else {
      this.getCommentList.disable();
      this.getCommentList.controls[index].enable({ onlySelf: true });
    }
    this.indexNote = index;
  }
  onClickRemoveFileAttach(indexOfNote: number, indexOfAttachment: number) {
    this.onRemoveAttachment(this.noteTask[indexOfNote].attachments[indexOfAttachment].uuidAttachment);
  }
  onClickchangeNotetype(index: number, comment: INoteTask): void {
    this.taskService
      .updateNoteType(!this.noteTask[index].isInternalNote, comment.uuidNote)
      .pipe(this.ngNeat.hotToast(), takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.noteTask[index].isInternalNote = !this.noteTask[index].isInternalNote;
        },
        (err) => {
          this.openErrorDialog(err);
        },
      );
  }
  onDeleteCommentTask(index: number, comment: INoteTask): void {
    const deleteNote = {
      uuidNote: comment.uuidNote,
      flowId: parseInt(this.taskDepartment, 10),
    };
    this.taskService
      .deleteNoteTask(deleteNote)
      .pipe(this.ngNeat.hotToast(), takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.noteTask.splice(index, 1);
          this.getCommentList.removeAt(index);
          this.getCommentList.disable();
        },
        (err) => {
          this.openErrorDialog(err);
        },
      );
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
  openTaskCallBack(): void {
    this.openTask.emit();
  }
  addAssigneeCallBack(groupAssignee: ITaskAssign[]): void {
    this.addAssignInCard.emit(groupAssignee);
  }
  changeTitleCallBack(title: string): void {
    this.changeTitle.emit(title);
  }
  addTagCallBack(tagTask: ITagTask[]): void {
    this.addTag.emit(tagTask);
  }
  onClickDeleteActiveTask() {
    const dialogRef = this.dialog.open(ModalConfirmDeleteComponent, {
      data: {
        title: 'Task',
      },
    });
    dialogRef.afterClosed().subscribe((actionDialog) => {
      if (actionDialog === Action.CONFIRM) {
        this.onDeleteTask();
      }
    });
  }
  onClickDeleteCommentTask(index: number, comment: INoteTask): void {
    const dialogRef = this.dialog.open(ModalConfirmDeleteComponent, {
      data: {
        title: 'comment task',
      },
    });
    dialogRef.afterClosed().subscribe((actionDialog) => {
      if (actionDialog === Action.CONFIRM) {
        this.onDeleteCommentTask(index, comment);
      }
    });
  }
  onDeleteAppointment(appointment): void {
    const dialogRef = this.dialog.open(ModalConfirmDeleteComponent, {
      data: {
        title: 'apppointment task',
      },
    });
    dialogRef.afterClosed().subscribe((actionDialog) => {
      if (actionDialog === Action.CONFIRM) {
        this.onDeleteAppointmentTask(appointment);
      }
    });
  }
  onClickOpenCreateDealDialog() {
    const dialogRef = this.dialog.open(FormCreateDealComponent, {
      width: '600px',
      maxHeight: '600px',
      data: { uuidTask: this.uuidTask, allAssignee: this.allAssignee },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.taskDealList.splice(0, 0, result);
        this._filter('');
      }
    });
  }

  onDeleteDealFromList(taskDeal: ITaskDealList) {
    const dialogRef = this.dialog.open(ModalConfirmDeleteComponent, {
      data: {
        title: 'Deal',
      },
    });
    dialogRef.afterClosed().subscribe((actionDialog) => {
      if (actionDialog === Action.CONFIRM) {
        this.deleteDeal(taskDeal);
      }
    });
  }
  deleteDeal(taskDeal: ITaskDealList) {
    const deleteDeal = { uuidDeal: taskDeal.uuidDeal, uuidTask: this.uuidTask };
    this.taskService
      .deleteDealDetailByUuidDeal(deleteDeal)
      .pipe(this.ngNeat.hotToast(), takeUntil(this.destroy$))
      .subscribe(
        (HTTPResult: IHTTPResult) => {
          if (HTTPResult.status) {
            this.taskDealList = this.taskDealList.filter((taskDealView) => taskDeal.uuidDeal !== taskDealView.uuidDeal);
          }
        },
        (err) => {
          this.openErrorDialog(err);
        },
      );
  }
  onClickAddDeal(index: number) {
    const insertDeal = { uuidDeal: this.optionsWithUuid[index].uuidDeal, uuidTask: this.uuidTask };
    this.taskService
      .insertDealToTask(insertDeal)
      .pipe(this.ngNeat.hotToast(), takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.taskService.getTaskDealListByTask(this.uuidTask).subscribe((taskDeal) => {
            this.taskDealList = taskDeal;
          });
        },
        (err) => {
          this.openErrorDialog(err);
        },
      );
  }
}
