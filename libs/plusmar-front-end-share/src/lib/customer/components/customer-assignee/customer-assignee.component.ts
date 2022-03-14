import { Component, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { slideInOutAnimation } from '@reactor-room/plusmar-front-end-share/animation';
import { AudienceContactService } from '@reactor-room/plusmar-front-end-share/services/audience-contact/audience-contact.service';
import { DialogService } from '@reactor-room/plusmar-front-end-share/services/dialog.service';
import { UserTagService } from '@reactor-room/plusmar-front-end-share/user/user-tag/user-tag.service';
import { GenericButtonMode, GenericDialogMode, IUserList } from '@reactor-room/itopplus-model-lib';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'reactor-room-customer-assignee',
  templateUrl: './customer-assignee.component.html',
  styleUrls: ['./customer-assignee.component.scss'],
  animations: [slideInOutAnimation],
})
export class CustomerAssigneeComponent implements OnInit, OnChanges, OnDestroy {
  @Input() customerId: number;
  @Input() audienceId: number;
  @Input() assigneeId: number;
  @Output() updateAssignee = new Subject<{ assigneeID: number }>();

  isShow = false;
  originUsers: IUserList[];
  users: IUserList[];
  destroy$: Subject<void> = new Subject<void>();

  currentAssignee: IUserList;
  searchText: string;
  searchTextDeboucee: Subject<void> = new Subject();

  caller = false;
  constructor(
    private userTagService: UserTagService,
    private toastr: ToastrService,
    private audienceContactService: AudienceContactService,
    private dialogService: DialogService,
  ) {}

  ngOnInit(): void {
    this.listenToAssigeeChanged();
    this.searchAssigneeDebouncer();
    this.getUserLists();
  }

  ngOnChanges(): void {
    if (this.assigneeId && this.users) {
      this.mapCurrentAssignee();
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }

  toggleSelectUser(): void {
    if (!this.assigneeId) {
      this.isShow = !this.isShow;
    }
  }
  closeDialog(isOutside: boolean): void {
    if (isOutside) {
      this.isShow = false;
    }
  }

  mapCurrentAssignee(): void {
    const assign = this.users.find((user) => user.userID === this.assigneeId);
    if (assign) {
      this.currentAssignee = assign;
      this.updateAssignee.next({ assigneeID: assign.userID });
    }
  }

  getUserLists(): void {
    this.userTagService
      .getUserList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => {
        this.originUsers = users;
        this.users = users;
        this.mapCurrentAssignee();
      });
  }

  unassignUser(): void {
    this.caller = true;
    this.isShow = false;
    this.dialogService.openDialog('Please confirm to unassign user', GenericDialogMode.CONFIRM, GenericButtonMode.CONFIRM).subscribe((yes: boolean) => {
      if (yes) {
        this.audienceContactService
          .setAudienceAssignee(this.audienceId, -1)
          .pipe(takeUntil(this.destroy$))
          .subscribe((response) => {
            if (response.status === 200) {
              this.assigneeId = undefined;
              this.updateAssignee.next({ assigneeID: -1 });
              this.toastr.success('Successfully', 'Unassigning');
            } else {
              this.toastr.error('Error, Please try again.', 'Unassigning');
            }
          });
      }
    });
  }
  assignUser(user: IUserList): void {
    this.caller = true;
    this.isShow = false;
    this.audienceContactService
      .setAudienceAssignee(this.audienceId, user.userID)
      .pipe(takeUntil(this.destroy$))
      .subscribe((response) => {
        if (response.status === 200) {
          this.assigneeId = user.userID;
          this.mapCurrentAssignee();
          this.toastr.success('Successfully', 'Assigning');
        } else {
          this.toastr.error('Error, Please try again.', 'Assigning');
        }
      });
  }

  filterSearchAssignee(): void {
    this.searchTextDeboucee.next(null);
  }
  searchAssigneeDebouncer(): void {
    this.searchTextDeboucee.pipe(takeUntil(this.destroy$), debounceTime(300)).subscribe(() => {
      if (this.searchText === '') this.users = this.originUsers;
      else {
        this.users = this.originUsers.filter((user) => {
          return user.userName.indexOf(this.searchText) !== -1;
        });
      }
    });
  }

  listenToAssigeeChanged(): void {
    // Subscription
    this.audienceContactService.updateAudienceAssignee = new Subject<{ audienceID: number; assigneeID: number }>();
    this.audienceContactService.updateAudienceAssignee.subscribe(({ assigneeID }) => {
      if (!this.caller) {
        if (assigneeID === -1) {
          this.assigneeId = undefined;
          this.currentAssignee = undefined;
        } else {
          this.assigneeId = assigneeID;
          this.mapCurrentAssignee();
        }
      }
      this.caller = false;
    });
  }
}
