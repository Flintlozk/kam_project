import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { ModalConfirmMoveTaskComponent } from '../../../../components/modal-confirm-move-task/modal-confirm-move-task.component';
import { ITaskDetail, IFlowTask, ViewTaskEnum, IUpdateTaskInput, ITagTask, IInsertTaskCross, IMemberFlow, TaskDetailEnum, ITaskAssign } from '../../task.model';
import { MatSidenav, MatSidenavContainer } from '@angular/material/sidenav';
import { TaskService } from '../../services/task.service';
import { groupBy } from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { ModalErrorComponent } from '../../../../components/modal-error/modal-error.component';
import { takeUntil } from 'rxjs/operators';
import { FlowConfigService } from '../../../flow-config/services/flow-config.service';
import { Action, CrudType, IUserDetail } from '@reactor-room/crm-models-lib';
import { IStateNodeConfig } from '@reactor-room/crm-models-lib';

@Component({
  selector: 'reactor-room-task-layout',
  templateUrl: './task-layout.component.html',
  styleUrls: ['./task-layout.component.scss'],
})
export class TaskLayoutComponent implements OnInit, OnDestroy {
  viewTask = ViewTaskEnum.CARD_VIEW;
  @ViewChild('drawer', { static: true }) drawer: MatSidenavContainer;
  showTaskDetail = true;
  flowTask: IFlowTask[] = [];
  viewType: string[] = [ViewTaskEnum.CARD_VIEW, ViewTaskEnum.LIST_VIEW];
  connectedTo = [];
  departmentTeam: string;
  cardDetail: ITaskDetail;
  tagTask: ITagTask[];
  sidenav: MatSidenav;
  subscribeGetTask: Subscription;
  subscribeGetDataRoute: Subscription;
  subscribeGetDetail: Subscription;
  subscribeMoveTask: Subscription;
  subscribeGetMemberFlow: Subscription;
  subscriptions: Subscription[];
  memberFlow: IMemberFlow[];
  fileData: File = null;
  disableEditContact: boolean;
  headerName: string;
  typeOfAction = CrudType.EDIT;
  flowConfigState: IStateNodeConfig[];
  destroy$: Subject<boolean> = new Subject<boolean>();
  taskItem: ITaskDetail;
  uuidTaskRoute: string;

  constructor(public dialog: MatDialog, private router: Router, private taskService: TaskService, private route: ActivatedRoute, private flowconfigService: FlowConfigService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.uuidTaskRoute = params['uuidTask'];
    });
    this.subscribeGetDataRoute = this.route.params.subscribe(
      (params) => {
        const { team } = params;
        this.departmentTeam = team;
        this.initialTask();

        this.flowconfigService.getGroupState(this.departmentTeam).subscribe(
          (groupState) => {
            this.headerName = groupState[0].fullName;
            if (groupState[0].allowToEdit) {
              this.disableEditContact = false;
            } else {
              this.disableEditContact = true;
            }
            this.flowConfigState = [];
            this.flowConfigState = JSON.parse(JSON.stringify(groupState[0].state));
            this.flowConfigState.forEach((v) => {
              delete v['__typename'];
            });
            this.getTask();
            if (this.uuidTaskRoute) {
              this.subscribeGetDetail = this.taskService.getTaskDetailById(this.uuidTaskRoute).subscribe(
                (taskDetail) => {
                  this.cardDetail = taskDetail;
                  this.drawer.open();
                },
                (err) => {
                  this.openErrorDialog(err);
                },
              );
            }
          },
          (err) => {
            this.openErrorDialog(err);
          },
        );
      },
      (err) => {
        this.openErrorDialog(err);
      },
    );

    this.subscriptions = [this.subscribeGetDataRoute, this.subscribeGetDetail, this.subscribeGetTask, this.subscribeMoveTask, this.subscribeGetMemberFlow];
  }
  openErrorDialog(err: string): void {
    this.dialog.open(ModalErrorComponent, {
      data: {
        text: err,
      },
    });
  }
  initialTask(): void {
    this.flowTask = [];
  }

  getTask(): void {
    this.subscribeGetMemberFlow = this.taskService.getMemberFlow(this.departmentTeam).subscribe(
      (allmemberByFlow) => {
        this.memberFlow = allmemberByFlow;
      },
      (err) => {
        this.openErrorDialog(err);
      },
    );

    this.subscribeGetTask = this.taskService.getTaskByFlow(this.departmentTeam).subscribe(
      (allTaskByFlow) => {
        let taskType: IFlowTask;
        const flow = groupBy(allTaskByFlow, TaskDetailEnum.STATUS_TYPE);
        this.flowConfigState.forEach((states) => {
          if (!flow.hasOwnProperty(states.statename)) {
            //flow[states.statename] = [];
            flow[states.statename][TaskDetailEnum.UUID_TASK] = states.uuidState;
          }
          const stateByFlow = states.statename;
          if (flow[stateByFlow].length > 0) {
            taskType = {
              id: flow[stateByFlow][0].uuidState,
              color: flow[stateByFlow][0].color,
              statename: stateByFlow,
              taskCard: flow[stateByFlow],
              click: (taskItem: ITaskDetail) => {
                this.taskItem = taskItem;
                void this.router.navigate([`/task/${this.departmentTeam}`], { queryParams: { uuidTask: taskItem.uuidTask } });
                this.openToggle(taskItem);
              },
              uuidState: flow[stateByFlow][0].uuidState,
            };
          } else {
            taskType = {
              statename: stateByFlow,
              id: flow[stateByFlow][TaskDetailEnum.UUID_TASK],
              taskCard: [],
              click: (taskItem: ITaskDetail) => this.openToggle(taskItem),
              uuidState: flow[stateByFlow][TaskDetailEnum.UUID_TASK],
            };
          }
          this.flowTask.push(taskType);
        });
        if (this.connectedTo) {
          this.connectedTo = [];
        }
        for (const task of this.flowTask) {
          this.connectedTo.push(task.id);
        }
      },
      (err) => {
        this.openErrorDialog(err);
      },
    );
  }
  openToggle(cardDetail: ITaskDetail): void {
    this.tagTask = cardDetail.tagTask;
    this.subscribeGetDetail = this.taskService.getTaskDetailById(cardDetail.uuidTask).subscribe(
      (taskDetail) => {
        this.cardDetail = taskDetail;
        this.drawer.open();
      },
      (err) => {
        this.openErrorDialog(err);
      },
    );
  }
  openDialog(
    cardDetail: ITaskDetail,
    updateDetail: IUpdateTaskInput,
    conditionUpdate: string,
    newTeam: string,
    newUuidState: string,
    newStateName: string,
    allUserInWorkFlow: IUserDetail[],
    event: CdkDragDrop<ITaskDetail[]>,
  ): void {
    const { previousContainer, container, previousIndex, currentIndex } = event;
    const dialogRef = this.dialog.open(ModalConfirmMoveTaskComponent, {
      data: {
        cardDetail: cardDetail,
        conditionUpdate: conditionUpdate,
        newState: newStateName,
        newTeam: newTeam,
        allUserInWorkFlow: allUserInWorkFlow,
      },
    });
    dialogRef.afterClosed().subscribe((actionDialog) => {
      if (actionDialog !== Action.CANCEL) {
        const message = { ...updateDetail, updateCross: true };
        const assigneeName = actionDialog.map((user) => user.name);
        const insertCross: IInsertTaskCross = {
          title: cardDetail.title,
          team: newTeam,
          uuidState: newUuidState,
          uuidCompany: cardDetail.uuidCompany,
          dueDate: cardDetail.dueDate,
          parentTaskUUID: message.uuidTask,
          assignee: assigneeName,
        };
        this.subscribeMoveTask = this.taskService
          .updateTaskById(message)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            () => {
              this.subscribeMoveTask = this.taskService
                .insertTaskCrossTeam(insertCross)
                .pipe(takeUntil(this.destroy$))
                .subscribe(
                  () => {},
                  (err) => {
                    this.openErrorDialog(err);
                  },
                  () => {
                    transferArrayItem(previousContainer.data, container.data, previousIndex, currentIndex);
                  },
                );
            },
            (err) => {
              this.openErrorDialog(err);
            },
            () => {},
          );
      }
    });
  }
  onInActiveTask(uuidTask: string) {
    let indexFlowStateRemove = 0;
    this.flowTask.filter((flowState, index) => {
      if (flowState.uuidState === this.cardDetail.uuidState) {
        indexFlowStateRemove = index;
      }
    });
    this.flowTask[indexFlowStateRemove].taskCard = this.flowTask[indexFlowStateRemove].taskCard.filter((allTaskByState) => {
      return allTaskByState.uuidTask !== uuidTask;
    });
    this.drawer.close();
  }
  onChangeView(viewType): void {
    this.viewTask = viewType.value;
  }

  dropTask(event: CdkDragDrop<ITaskDetail[]>): void {
    let message: IUpdateTaskInput;
    const { previousContainer, container, previousIndex, currentIndex } = event;
    const carddetail: ITaskDetail = previousContainer.data[previousIndex];
    if (previousContainer === container) {
      moveItemInArray(container.data, previousIndex, currentIndex);
    } else {
      message = {
        uuidTask: previousContainer.data[previousIndex].uuidTask,
        previousStatusType: previousContainer.id,
        team: this.departmentTeam,
        uuidState: container.id,
        updateCross: false,
      };
      this.subscribeMoveTask = this.taskService.updateTaskById(message).subscribe(
        (updateTaskResult) => {
          if (updateTaskResult.status === 100) {
            const { conditions, team, uuidState, stateName, allUserInWorkFlow } = updateTaskResult.value;
            this.openDialog(carddetail, message, conditions, team, uuidState, stateName, allUserInWorkFlow, event);
          } else {
            transferArrayItem(previousContainer.data, container.data, previousIndex, currentIndex);
          }
        },
        (err) => {
          this.openErrorDialog(err);
        },
      );
    }
  }

  addAssigneeCallBack(groupAssignee: ITaskAssign[]) {
    this.taskItem.assignee = groupAssignee;
  }
  changeTitleCallBack(taskTitle: string) {
    this.taskItem.title = taskTitle;
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    [...this.subscriptions].forEach((subscription: Subscription) => {
      if (subscription) subscription.unsubscribe();
    });
  }
  setDefaultRoute() {
    void this.router.navigate([`/task/${this.departmentTeam}`]);
  }
  addTagCallBack(tagTask: ITagTask[]) {
    this.taskItem.tagTask = tagTask;
  }
}
