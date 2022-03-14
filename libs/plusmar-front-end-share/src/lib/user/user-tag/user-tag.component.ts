import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ICustomerTagCRUD, IUserAndTagsList } from '@reactor-room/itopplus-model-lib';
import { isEmpty } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserTagService } from './user-tag.service';

@Component({
  selector: 'reactor-room-user-tag',
  templateUrl: './user-tag.component.html',
  styleUrls: ['./user-tag.component.scss'],
})
export class UserTagComponent implements OnInit, OnDestroy {
  destroy$: Subject<void> = new Subject<void>();
  users: IUserAndTagsList[];
  cloneUsers: IUserAndTagsList[];
  toastPosition = 'toast-bottom-right';
  constructor(
    private dialogRef: MatDialogRef<UserTagComponent>,
    @Inject(MAT_DIALOG_DATA) public editTagData: ICustomerTagCRUD,
    private userTagService: UserTagService,
    private toastr: ToastrService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.getUserList();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  getUserList(): void {
    this.userTagService
      .getUsersAndTags(this.editTagData.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((users) => {
        this.users = users;
        this.cloneUsers = JSON.parse(JSON.stringify(users));
      });
  }

  onAssinging({ target }: InputEvent, userID: number): void {
    const isCheck = (<HTMLInputElement>target).checked;
    this.users.filter((item) => {
      if (item.userID === userID) {
        item.isActive = isCheck;
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onAssignUser(): void {
    const filterDiff = [];
    this.cloneUsers.map((clone) => {
      const getDiff = this.users.find((user) => {
        return user.userID === clone.userID && user.isActive !== clone.isActive;
      });
      if (!isEmpty(getDiff)) filterDiff.push({ tagID: this.editTagData.id, userID: getDiff.userID, isActive: getDiff.isActive });
    });

    this.userTagService.assignUsersTag(filterDiff).subscribe({
      next: () => {
        this.toastr.success(this.translate.instant('Tag assigned'), this.translate.instant('Success'), { positionClass: this.toastPosition });
        this.dialogRef.close(true);
      },
      error: () => {
        this.toastr.error(this.translate.instant('Fail to assign tag'), this.translate.instant('Update Failed'), { positionClass: this.toastPosition });
      },
    });
  }
}
