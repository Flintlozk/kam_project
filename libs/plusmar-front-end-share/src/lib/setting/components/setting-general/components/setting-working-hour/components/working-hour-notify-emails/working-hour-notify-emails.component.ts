import { Component, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { slideInOutAnimation } from '@reactor-room/plusmar-front-end-share/animation';
import { UserTagService } from '@reactor-room/plusmar-front-end-share/user/user-tag/user-tag.service';
import { IUserList } from '@reactor-room/itopplus-model-lib';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'reactor-room-working-hour-notify-emails',
  templateUrl: './working-hour-notify-emails.component.html',
  styleUrls: ['./working-hour-notify-emails.component.scss'],
  animations: [slideInOutAnimation],
})
export class WorkingHourNotifyEmailsComponent implements OnInit, OnChanges, OnDestroy {
  isShow = false;
  destroy$: Subject<void> = new Subject<void>();

  users: IUserList[];
  originUsers: IUserList[];

  // searchText: string;
  searchTextDeboucee: Subject<void> = new Subject();
  filterDeboucee: Subject<void> = new Subject();
  notifyForm: FormGroup;

  @Input() emailList: { email: string }[];
  @Output() selectEmail: Subject<string> = new Subject<string>();

  constructor(private formBuilder: FormBuilder, private userTagService: UserTagService) {}

  ngOnInit(): void {
    this.notifyForm = this.formBuilder.group({
      notifyEmail: ['', [Validators.required, Validators.email]],
    });

    this.searchEmailDebouncer();
    this.filterEmailDebouncer();
    this.getUserLists();
  }

  ngOnChanges(): void {
    this.filterDeboucee.next(null);
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  getUserLists(): void {
    this.userTagService
      .getUserList()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => {
        this.users = users;
        this.originUsers = users;
        // this.mapCurrentAssignee();

        this.filterDeboucee.next(null);
      });
  }

  toggleSelectUser(): void {
    this.isShow = !this.isShow;
  }

  closeDialog(isOutside: boolean): void {
    if (isOutside) {
      this.isShow = false;
    }
  }

  onAddUser(): void {
    const email = this.notifyForm.value.notifyEmail;
    if (this.notifyForm.valid) {
      this.isShow = false;
      this.selectEmail.next(email);
      this.notifyForm.reset();
    }
  }

  selectUser(user: IUserList): void {
    const email = user?.userNotifyEmail || user?.userEmail;
    if (email) {
      this.isShow = false;
      this.selectEmail.next(email);
      this.notifyForm.reset();
    }
  }

  searchEmailDebouncer(): void {
    this.searchTextDeboucee.pipe(takeUntil(this.destroy$), debounceTime(300)).subscribe(() => {
      if (this.notifyForm.value.notifyEmail === '') {
        this.filterDeboucee.next(null);
      } else {
        const emails = this.emailList.map((x) => x.email);
        this.users = this.originUsers.filter((user) => {
          const name = user.userName.indexOf(this.notifyForm.value.notifyEmail) !== -1;
          const email = user?.userNotifyEmail || user?.userEmail;
          const notifyEmail = email === null ? -1 : email.indexOf(this.notifyForm.value.notifyEmail) !== -1;
          return (name || notifyEmail) && !emails.includes(email);
        });
      }
    });
  }
  filterEmailDebouncer(): void {
    this.filterDeboucee.pipe(takeUntil(this.destroy$), debounceTime(300)).subscribe(() => {
      if (this.originUsers) {
        const emails = this.emailList.map((x) => x.email);
        this.users = this.originUsers.filter((user) => {
          const email = user?.userNotifyEmail || user?.userEmail;
          return !emails.includes(email);
        });
      }
    });
  }
}
