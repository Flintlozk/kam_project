import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserManagementService } from './user-management.service';
import { IUserResponseData } from '@reactor-room/cms-models-lib';
import { chunk } from 'lodash';
import { IHeadervariable } from '../../type/headerType';
@Component({
  selector: 'reactor-room-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit {
  displayModal = false;
  offset = 0;
  limit = 10;
  countLoadMore = 0;
  userAppRole = [
    { view: 'Admin User', value: 'CMS-ADMIN' },
    { view: 'Template Manager', value: 'CMS-TEMPLATE' },
    { view: 'Domian Manager', value: 'CMS-DOMAIN' },
    { view: 'CS Manager', value: 'CMS-CS' },
  ];
  userList: IUserResponseData[] = [];
  userListTemp: IUserResponseData[] = [];
  sendInviteByEmailValue = '';
  sendInviteByRoleValue = '';
  tableHeader = [
    { sort: true, title: 'User Name' },
    { sort: true, title: 'Email' },
    { sort: true, title: 'Role' },
  ];
  name: IHeadervariable = {
    topicName: 'Template',
    buttonName: 'Invite',
  };
  destroy$: Subject<boolean> = new Subject();
  constructor(private userManagementService: UserManagementService) {}

  ngOnInit(): void {
    try {
      this.userManagementService
        .getUser()
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (result) => {
            this.userList = result;
            this.loadMoreData();
          },
          (err) => {
            console.log('err.message ::>', err);
          },
        );
    } catch (err) {
      throw new Error(err);
    }
  }
  sendInviteByEmail(): void {
    try {
      this.userManagementService
        .sendInvitation(this.sendInviteByEmailValue, this.sendInviteByRoleValue)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (result) => {
            this.close(true);
          },
          (err) => {
            console.log('err.message ::>', err);
          },
        );
    } catch (err) {
      throw new Error(err);
    }
  }
  close(isclose: boolean): void {
    this.displayModal = isclose;
  }
  getValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }
  radioChangeHandler(event: any): void {
    this.sendInviteByRoleValue = event.target.value;
  }
  loadMoreData(): void {
    this.countLoadMore++;
    this.offset = this.limit * this.countLoadMore;
    if (this.offset > this.userList.length) {
      this.offset = this.userList.length;
    }
    const [userListTemp] = chunk(this.userList, this.offset);
    this.userListTemp = userListTemp;
  }
  trackByIndex(index: number): string {
    return this.userListTemp[index].name;
  }
}
