import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Injectable, OnDestroy } from '@angular/core';

import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import {
  ITaskDetail,
  IUpdateTaskInput,
  IInsertTagInput,
  IInsertAppointInput,
  ITaskAssign,
  INoteTask,
  IInsertNoteTaskInput,
  IInsertAssignTaskInput,
  ITaskDealInsertInput,
  IInsertTaskCross,
  IUpdateTaskTitleInput,
  IMemberFlow,
  IContactTask,
  ICompanyContactUpdate,
  ICompanyContactInsert,
  IUpdateActiveTask,
  IInsertTaskByLead,
  IEditAppointInput,
} from '../task.model';
import { IHTTPResult } from '@reactor-room/model-lib';
import { IDealDate, IDealDetail, IDealDetailWithTag, IFilterDeal, IInsertDeal, IMediaAmount, IProductAmount, IProjectCode, ITagDeal, ITagTask } from '@reactor-room/crm-models-lib';

@Injectable({
  providedIn: 'root',
})
export class TaskService implements OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private apollo: Apollo) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  getTaskByFlow(flowId: string): Observable<ITaskDetail[]> {
    return this.apollo
      .watchQuery({
        query: gql`
          query getTaskByFlow($flowId: String) {
            getTaskByFlow(flowId: $flowId) {
              title
              owner
              detail
              name
              tagname
              email
              phoneNumber
              statusType
              uuidTask
              companyname
              uuidCompany
              uuidState
              dueDate
              color
              tagTask {
                ... on getTagTask {
                  tagname
                  color
                  tagId
                }
              }
              assignee {
                ... on getTaskAssignByTeam {
                  name
                  email
                  profilePic
                }
              }
              countDetail {
                ... on getCountDetail {
                  count
                  counttable
                }
              }
            }
          }
        `,
        fetchPolicy: 'no-cache',
        variables: {
          flowId: flowId,
        },
      })
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getTaskByFlow']),
      );
  }

  getUserAssign(): Observable<IContactTask[]> {
    return this.apollo
      .watchQuery({
        query: gql`
          query getUserAssign {
            getUserAssign {
              name
              email
            }
          }
        `,
      })
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getUserAssign']),
      );
  }

  getMemberFlow(flowName: string): Observable<IMemberFlow[]> {
    return this.apollo
      .watchQuery({
        query: gql`
          query getMemberFlow($flowName: String) {
            getMemberFlow(flowName: $flowName) {
              username
              profilePic
              rolename
            }
          }
        `,
        variables: {
          flowName: flowName,
        },
      })
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getMemberFlow']),
      );
  }

  updateTaskById(message: IUpdateTaskInput): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation updateTaskById($message: UpdateTaskInput) {
            updateTaskById(message: $message) {
              status
              value {
                conditions
                newState
                uuidState
                stateName
                team
                allUserInWorkFlow {
                  name
                  profilePic
                }
              }
            }
          }
        `,
        variables: {
          message: message,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updateTaskById']),
      );
  }
  updateCompanyContact(message: ICompanyContactUpdate): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation updateCompanyContactFromTask($message: UpdateCompanyContactDetail) {
            updateCompanyContactFromTask(message: $message) {
              status
              value
            }
          }
        `,
        variables: {
          message: message,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updateCompanyContact']),
      );
  }
  insertCompanyContactTask(message: ICompanyContactInsert): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation insertCompanyContactTask($message: InsertCompanyContactDetail) {
            insertCompanyContactTask(message: $message) {
              status
              value
            }
          }
        `,
        variables: {
          message: message,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['insertCompanyContactTask']),
      );
  }
  updateTaskTitle(message: IUpdateTaskTitleInput): Observable<ITaskDetail> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation updateTaskTitle($message: UpdateTaskTitleInput) {
            updateTaskTitle(message: $message) {
              status
              value
            }
          }
        `,
        variables: {
          message: message,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updateTaskTitle']),
      );
  }
  deleteTagTask(tagId: number): Observable<ITagTask> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation deleteTagTask($tagId: Int) {
            deleteTagTask(tagId: $tagId) {
              status
              value
            }
          }
        `,
        variables: {
          tagId: tagId,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['deleteTagTask']),
      );
  }
  insertTag(message: IInsertTagInput): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation insertTag($message: InsertTagInput) {
            insertTag(message: $message) {
              status
              value
            }
          }
        `,
        variables: {
          message: message,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['insertTag']),
      );
  }
  insertAssignTask(message: IInsertAssignTaskInput): Observable<ITaskAssign> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation insertAssignTask($message: InsertAssignTaskInput) {
            insertAssignTask(message: $message) {
              status
              value
            }
          }
        `,
        variables: {
          message: message,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['insertAssignTask']),
      );
  }
  insertAppointment(message: IInsertAppointInput): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation insertAppointmentTask($message: InsertAppointInput) {
            insertAppointmentTask(message: $message) {
              status
              value
            }
          }
        `,
        variables: {
          message: message,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['insertAppointmentTask']),
      );
  }
  editAppointment(message: IEditAppointInput): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation editAppointmentTask($message: EditAppointInput) {
            editAppointmentTask(message: $message) {
              status
              value
            }
          }
        `,
        variables: {
          message: message,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['editAppointmentTask']),
      );
  }
  deleteAppointmentTask(uuidAppointment: string): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation deleteAppointmentTask($uuidAppointment: String) {
            deleteAppointmentTask(uuidAppointment: $uuidAppointment) {
              status
              value
            }
          }
        `,
        variables: {
          uuidAppointment: uuidAppointment,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['deleteAppointmentTask']),
      );
  }
  insertNoteTask(files: File[], message: IInsertNoteTaskInput): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation insertNoteTask($files: [Upload!]!, $message: InsertNoteTaskInput) {
            insertNoteTask(files: $files, message: $message) {
              status
              value
            }
          }
        `,
        variables: {
          files: files,
          message: message,
        },
        context: {
          useMultipart: true,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['insertNoteTask']),
      );
  }
  updateNoteTask(message): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation updateNoteTask($message: UpdateNoteTaskInput) {
            updateNoteTask(message: $message) {
              status
              value
            }
          }
        `,
        variables: {
          message: message,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updateNoteTask']),
      );
  }
  deleteNoteTask(message): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation deleteNoteTask($message: DeleteNoteTaskInput) {
            deleteNoteTask(message: $message) {
              status
              value
            }
          }
        `,
        variables: {
          message: message,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['deleteNoteTask']),
      );
  }

  getTaskDetailById(uuidTask: string): Observable<ITaskDetail> {
    return this.apollo
      .watchQuery({
        query: gql`
          query getTaskDetailById($uuidTask: String) {
            getTaskDetailById(uuidTask: $uuidTask) {
              companyId
              companyname
              note
              tagname
              taskId
              title
              uuidTask
              uuidCompany
              uuidState
              createDate
              tagTask
              myProfilePic
              myName
              mediaAmount
              productAmount
              startDate
              endDate
              assignee {
                ... on getTaskAssignByTeam {
                  name
                  email
                  profilePic
                }
              }
              noteTask {
                ... on getNoteByTask {
                  noteDetail
                  favourite
                  isInternalNote
                  attachments {
                    attachmentLink
                    attachmentName
                    uuidAttachment
                  }
                  createBy
                  profilePic
                  createDate
                  uuidNote
                  uuidTask
                }
              }
              contactTask {
                ... on getContactTask {
                  name
                  email
                  phoneNumber
                  contactCompanyId
                  primaryContact
                  companyId
                  position
                  lineId
                }
              }
              appointmentTask {
                ... on getAppointmentTask {
                  uuidAppointment
                  appointmentStartDate
                  appointmentEndDate
                  note
                  createBy
                  profilePic
                  htmlLink
                }
              }
              taskDeal {
                ... on getTaskDealListByTask {
                  dealtitle
                  objective
                  name
                  profilePic
                  startDate
                  endDate
                  uuidDeal
                }
              }
              getFile {
                ... on getFileListFromTask {
                  fileName
                }
              }
              getAllUser {
                ... on getAllUser {
                  name
                  email
                  profilePic
                }
              }
              companyAddress {
                ... on getCompanyAddress {
                  companyname
                }
              }
              nextStateTask {
                ... on getNextStateTask {
                  statename
                  stateid
                  uuidState
                }
              }
            }
          }
        `,
        variables: {
          uuidTask: uuidTask,
        },
        fetchPolicy: 'no-cache',
      })
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getTaskDetailById']),
      );
  }
  deleteAttachment(uuidAttachment: string): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation deleteAttachment($uuidAttachment: String) {
            deleteAttachment(uuidAttachment: $uuidAttachment) {
              status
              value
            }
          }
        `,
        variables: {
          uuidAttachment: uuidAttachment,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['deleteAttachment']),
      );
  }
  insertTaskCrossTeam(message: IInsertTaskCross): Observable<ITaskDetail> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation insertTaskCrossTeam($message: InsertTaskCrossInput) {
            insertTaskCrossTeam(message: $message) {
              status
              value
            }
          }
        `,
        variables: {
          message: message,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['insertTaskCrossTeam']),
      );
  }
  updateActiveTask(message: IUpdateActiveTask): Observable<ITaskDetail> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation updateActiveTask($message: UpdateActiveTaskInput) {
            updateActiveTask(message: $message) {
              status
              value
            }
          }
        `,
        variables: {
          message: message,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updateActiveTask']),
      );
  }
  insertTaskDealByTask(message: ITaskDealInsertInput): Observable<INoteTask> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation insertTaskDealByTask($message: InsertTaskDealByTaskInput) {
            insertTaskDealByTask(message: $message) {
              status
              value
            }
          }
        `,
        variables: {
          message: message,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['insertTaskDealByTask']),
      );
  }

  insertTaskByLead(files: File[], message: IInsertTaskByLead): Observable<INoteTask> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation insertTaskByLead($files: [Upload!]!, $message: InsertTaskByLead) {
            insertTaskByLead(files: $files, message: $message) {
              status
              value
            }
          }
        `,
        variables: {
          files: files,
          message: message,
        },
        context: {
          useMultipart: true,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['insertTaskByLead']),
      );
  }
  updateNoteType(isInternalNote: boolean, uuidNote: string): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation updateNoteType($message: InternalNoteInput) {
            updateNoteType(message: $message) {
              status
              value
            }
          }
        `,
        variables: {
          message: { isInternalNote: isInternalNote, uuidNote: uuidNote },
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updateNoteType']),
      );
  }
  updateDealDateForTask(dealDate: IDealDate): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation updateDealDateForTask($message: DealDateInput) {
            updateDealDateForTask(message: $message) {
              status
              value
            }
          }
        `,
        variables: {
          message: dealDate,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updateDealDateForTask']),
      );
  }
  updateProductAmountForTask(productAmount: IProductAmount): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation updateProductAmountForTask($message: productAmountInput) {
            updateProductAmountForTask(message: $message) {
              status
              value
            }
          }
        `,
        variables: {
          message: productAmount,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updateProductAmountForTask']),
      );
  }
  updateMediaAmountForTask(mediaAmount: IMediaAmount): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation updateMediaAmountForTask($message: mediaAmountInput) {
            updateMediaAmountForTask(message: $message) {
              status
              value
            }
          }
        `,
        variables: {
          message: mediaAmount,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updateMediaAmountForTask']),
      );
  }
  insertDealDetailByTask(dealDetail: IDealDetail): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation insertDealDetailByTask($message: InsertDealDetailinput) {
            insertDealDetailByTask(message: $message) {
              status
              value
            }
          }
        `,
        variables: {
          message: dealDetail,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['insertDealDetailByTask']),
      );
  }
  getDealDetailByUuidDeal(uuidDeal: string): Observable<IDealDetailWithTag> {
    return this.apollo
      .watchQuery({
        query: gql`
          query getDealDetailByUuidDeal($uuidDeal: String) {
            getDealDetailByUuidDeal(uuidDeal: $uuidDeal) {
              dealtitle
              projectNumber
              startDate
              endDate
              advertiseBefore
              paymentDetail
              productService
              objective
              target
              adsOptimizeFee
              adsSpend
              noteDetail
              accountExecutive
              projectManager
              headOfClient
              tagDealList {
                tagDealId
              }
            }
          }
        `,
        variables: {
          uuidDeal: uuidDeal,
        },
        fetchPolicy: 'no-cache',
      })
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getDealDetailByUuidDeal']),
      );
  }

  updateDealDetailByUuidDeal(dealDetail: IDealDetail): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation updateDealDetailByUuidDeal($message: UpdateDealDetailinput) {
            updateDealDetailByUuidDeal(message: $message) {
              status
              value
            }
          }
        `,
        variables: {
          message: dealDetail,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updateDealDetailByUuidDeal']),
      );
  }
  getTagDealByOwner(): Observable<ITagDeal[]> {
    return this.apollo
      .watchQuery({
        query: gql`
          query getTagDealByOwner {
            getTagDealByOwner {
              tagName
              tagColor
              tagDealId
            }
          }
        `,
      })
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getTagDealByOwner']),
      );
  }
  deleteDealDetailByUuidDeal(message: IInsertDeal): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation deleteDealDetailByUuidDeal($message: InsertDeal) {
            deleteDealDetailByUuidDeal(message: $message) {
              status
              value
            }
          }
        `,
        variables: {
          message: message,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['deleteDealDetailByUuidDeal']),
      );
  }
  getProjectCodeOfDeal(message: IFilterDeal): Observable<IProjectCode[]> {
    return this.apollo
      .watchQuery({
        query: gql`
          query getProjectCodeOfDeal($message: FilterDeal) {
            getProjectCodeOfDeal(message: $message) {
              projectCode
              uuidDeal
              dealTitle
              companyName
            }
          }
        `,
        variables: {
          message: message,
        },
        fetchPolicy: 'no-cache',
      })
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getProjectCodeOfDeal']),
      );
  }
  insertDealToTask(message: IInsertDeal): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation insertDealToTask($message: InsertDeal) {
            insertDealToTask(message: $message) {
              status
              value
            }
          }
        `,
        variables: {
          message: message,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['insertDealToTask']),
      );
  }
  getTaskDealListByTask(uuidTask: string) {
    return this.apollo
      .watchQuery({
        query: gql`
          query getTaskDealListByTask($uuidTask: String) {
            getTaskDealListByTask(uuidTask: $uuidTask) {
              dealtitle
              objective
              name
              profilePic
              startDate
              endDate
              uuidDeal
            }
          }
        `,
        variables: {
          uuidTask: uuidTask,
        },
        fetchPolicy: 'no-cache',
      })
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getTaskDealListByTask']),
      );
  }
}
