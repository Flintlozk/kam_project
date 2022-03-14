import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogComponent } from '@reactor-room/itopplus-cdk/confirm-dialog/confirm-dialog.component';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk/success-dialog/success-dialog.component';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { ResourceValidationService } from '@reactor-room/plusmar-front-end-share/services/resource-validation/resource-validation.service';
import { UserAliasNameComponent } from '@reactor-room/plusmar-front-end-share/user/user-alias-name/user-alias-name.component';
import { UserNotifyEmailDialogComponent } from '@reactor-room/plusmar-front-end-share/user/user-notify-email-dialog/user-notify-email-dialog.component';
import { UserRoleDialogComponent } from '@reactor-room/plusmar-front-end-share/user/user-role-dialog/user-role-dialog.component';
import { PageMemberService } from '@reactor-room/plusmar-front-end-share/services/settings/page-member.service';
import { TokenGeneratorService } from '@reactor-room/plusmar-front-end-share/services/token-generater.service';
import { SettingsService } from '@reactor-room/plusmar-front-end-share/services/settings/setting.service';
import { UserService } from '@reactor-room/plusmar-front-end-share/services/user/user.service';
import {
  EnumAuthError,
  EnumAuthScope,
  EnumPageMemberType,
  EnumResourceValidation,
  GenericButtonMode,
  GenericDialogData,
  GenericDialogMode,
  IPageMemberInviteInput,
  IPageMemberModel,
  ISettingPageMember,
  ThemeWithIPageMemberModel,
} from '@reactor-room/itopplus-model-lib';
import { combineLatest, Observable, Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { SettingDirectAdminDialogComponent } from './components';
import { GenericDialogComponent } from '@reactor-room/plusmar-cdk';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'reactor-room-setting-direct-admin',
  templateUrl: './setting-direct-admin.component.html',
  styleUrls: ['./setting-direct-admin.component.scss'],
})
export class SettingDirectAdminComponent implements OnInit, OnDestroy {
  @Input() role: string;
  @Input() theme = EnumAuthScope.SOCIAL;
  themeType = EnumAuthScope;
  isLoading = false;
  loadingText = 'Sending request...';
  userEmail: string;
  userID: number;
  isInvitable = false;
  isAllowed = false;
  destroy$: Subject<boolean> = new Subject<boolean>();
  successDialog;
  tableHeader;

  tableData: IPageMemberModel[];

  constructor(
    private dialog: MatDialog,
    public translate: TranslateService,
    private pageMemberService: PageMemberService,
    private settingsService: SettingsService,
    private userService: UserService,
    private tokentService: TokenGeneratorService,
    private resourceValidationService: ResourceValidationService,
    private toastr: ToastrService,
  ) {
    translate.onLangChange.subscribe(() => {
      this.setLabels();
    });
  }
  setLabels(): void {
    this.tableHeader = [
      { sort: false, title: this.translate.instant('Name'), key: null },
      { sort: false, title: this.translate.instant('Alias name'), key: null },
      { sort: false, title: this.translate.instant('Email'), key: null },
      { sort: false, title: this.translate.instant('Notify Email'), key: null },
      { sort: false, title: this.translate.instant('Role'), key: null },
      { sort: false, title: this.translate.instant('Status'), key: null },
      { sort: false, title: this.translate.instant('Action'), key: null },
    ];
  }

  openInviteDialog(): void {
    const requestValidations: EnumResourceValidation[] = [EnumResourceValidation.VALIDATE_MAX_PAGE_MEMBERS];
    this.resourceValidationService
      .validateResources(requestValidations)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.openDialog();
        },
        (err) => {
          if (err.message.indexOf('MEMBER_REACHED_LIMIT') !== -1) {
            this.openSuccessDialog({ text: this.translate.instant('Number of admin page is reach limit'), title: this.translate.instant('Send invitation denied') }, true);
          } else {
            this.openSuccessDialog(
              {
                text: this.translate.instant('Something went wrong when loading member list, please try again later. For more information, please contact us at 02-029-1200'),
                title: 'Error !',
              },
              true,
            );
            console.log(err);
          }
        },
      );
  }

  openDialog(): void {
    if (!this.isLoading) {
      const dialogRef = this.dialog.open(SettingDirectAdminDialogComponent, {
        data: { pageMemberModel: this.tableData, theme: this.theme },
        width: '100%',
        maxWidth: '450px',
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result && result.isSave) {
          this.isLoading = true;
          this.sendInvitation(result.addMember);
        }
      });
    }
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.setLabels();
    this.checkIsUserHavePermission();
    this.getPageMemberData();
  }

  getPageMemberData(): void {
    combineLatest([this.getPageMember(), this.getPageMemberDetail()])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([pageMember, pageMemberDetai]) => {
        if (pageMember && pageMemberDetai) {
          this.tableData = pageMember;
          this.isInvitable = !(pageMemberDetai.memberlimit === pageMemberDetai.memberusing);
        } else {
          this.openSuccessDialog(
            {
              text: this.translate.instant('Something went wrong when loading shop member details, please try again later. For more information, please contact us at 02-029-1200'),
              title: 'Error !',
            },
            true,
          );
        }
        this.isLoading = false;
      });
  }

  openChangeUserAliasDialog(user: IPageMemberModel): void {
    const currentName = user.alias;
    this.dialog
      .open<UserAliasNameComponent, ThemeWithIPageMemberModel>(UserAliasNameComponent, { width: '100%', maxWidth: '450px', data: { pageMemberModel: user, theme: this.theme } })
      .afterClosed()
      .subscribe((result: { aliasName: string }) => {
        if (result && currentName !== result.aliasName) {
          this.pageMemberService.setPageMemberAlias(user.user_id, result.aliasName).subscribe(
            () => {
              this.toastr.success('Set alias success', 'Set Alias');
            },
            () => {
              this.toastr.error('Set alias fail', 'Set Alias');
            },
          );
        }
      });
  }
  openChangeUserNotifyEmailDialog(user: IPageMemberModel): void {
    const currentEmail = user.notify_email;
    this.dialog
      .open<UserNotifyEmailDialogComponent, ThemeWithIPageMemberModel>(UserNotifyEmailDialogComponent, {
        width: '100%',
        maxWidth: '450px',
        data: { pageMemberModel: user, theme: this.theme },
      })
      .afterClosed()
      .subscribe((result: { notifyEmail: string }) => {
        if (result && currentEmail !== result.notifyEmail) {
          this.pageMemberService.setPageMemberNotifyEmail(user.user_id, result.notifyEmail).subscribe(
            () => {
              this.toastr.success('Set notify email success', 'Set Notify Email');
            },
            () => {
              this.toastr.error('Set notify email fail', 'Set Notify Email');
            },
          );
        }
      });
  }

  openChangeUserRoleDialog(user: IPageMemberModel): void {
    const dialogConfig = { width: '100%', maxWidth: '450px', data: { pageMemberModel: user, theme: this.theme } };
    this.dialog
      .open<UserRoleDialogComponent, ThemeWithIPageMemberModel, EnumPageMemberType>(UserRoleDialogComponent, dialogConfig)
      .afterClosed()
      .subscribe((selectedRole: EnumPageMemberType) => {
        if (selectedRole) {
          this.pageMemberService.setPageMemberRole(user.user_id, selectedRole).subscribe(
            () => {
              this.toastr.success('Set user role success', 'Set User Role');
            },
            () => {
              this.toastr.error('Set user role fail', 'Set User Role');
            },
          );
        }
      });
  }

  checkIsUserHavePermission(): void {
    if (this.theme === this.themeType.CMS) {
      if (this.role !== EnumPageMemberType.STAFF) this.isAllowed = true;
    } else {
      this.userService.$userPageRole.pipe(takeUntil(this.destroy$)).subscribe((userRole) => {
        if (userRole !== EnumPageMemberType.STAFF) this.isAllowed = true;
      });
    }
  }

  getPageMember(): Observable<IPageMemberModel[]> {
    return this.pageMemberService.getPageMembersByPageID().pipe(takeUntil(this.destroy$));
  }

  getPageMemberDetail(): Observable<ISettingPageMember> {
    return this.settingsService.getPageMemberDetail().pipe(takeUntil(this.destroy$));
  }

  sendInvitation(newMemberData: { email: string; position: string }): void {
    this.isLoading = true;
    const memberData: IPageMemberInviteInput = {
      email: newMemberData.email,
      role: newMemberData.position === 'Staff' ? EnumPageMemberType.STAFF : EnumPageMemberType.ADMIN,
    };
    this.pageMemberService
      .sendInvitationEmail(memberData)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.isLoading = false)),
      )
      .subscribe(
        () => {
          this.openSuccessDialog({ text: this.translate.instant('Data have been invited successfully...'), title: this.translate.instant('Invited Successfully!') });
        },
        (err) => {
          if (err.message.indexOf(EnumAuthError.PERMISSION_DENIED) !== -1) {
            this.openSuccessDialog(
              { text: this.translate.instant('Only owner and admin have permission to manage this part'), title: this.translate.instant('Permission denied!') },
              true,
            );
          } else if (err.message.indexOf('MEMBER_REACHED_LIMIT') !== -1) {
            this.openSuccessDialog({ text: this.translate.instant('Number of admin page is reach limit'), title: this.translate.instant('Send invitation denied') }, true);
          } else {
            this.openSuccessDialog(
              {
                text: this.translate.instant(
                  'Something went wrong when tryig to send invitation email, please try again later. For more information, please contact us at 02-029-1200',
                ),
                title: 'Error !',
              },
              true,
            );
            console.log(err);
          }
        },
      );
  }

  openSuccessDialog(message: { text: string; title: string }, isError = false): void {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
      data: isError,
    });

    dialogRef.componentInstance.data = message;
    dialogRef.componentInstance.isError = isError;
  }

  openConfirmRemoveDialog(id: number): void {
    this.userID = id;
    this.successDialog = undefined;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    dialogRef.componentInstance.data = {
      title: this.translate.instant('Confirm Remove'),
      text: this.translate.instant('Are you sure you want to remove this member'),
      btnOkClick: this.removePageMember.bind(this),
    };
  }

  openConfirmActivateDialog(mail: string): void {
    this.tokentService
      .getInvitationTokenByEmail(mail)
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        if (result.status == 200) {
          this.successDialog = true;
          this.dialog.open(GenericDialogComponent, <{ width: string; data: GenericDialogData }>{
            width: isMobile() ? '90%' : '50%',
            data: {
              text: this.translate.instant('Please copy this link'),
              title: this.translate.instant('Confirm to activate this account'),
              dialogMode: GenericDialogMode.COPY,
              buttonMode: GenericButtonMode.CLOSE,
              value: result.value,
              disableClose: false,
              isError: false,
            },
          });
        } else {
          const dialogData = {
            title: this.translate.instant('Something went wrong'),
            text: this.translate.instant(result.value),
          };
          const dialog = this.dialog.open(SuccessDialogComponent, { width: '422px' });
          dialog.componentInstance['data'] = dialogData;
          dialog.componentInstance.isError = true;
        }
      });
  }

  removePageMember(): void {
    this.pageMemberService
      .removePageMember(this.userID)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.openSuccessDialog({ text: this.translate.instant('Data have been removed successfully'), title: this.translate.instant('Removed Successfully') });
        },
        (err) => {
          if (err.message.indexOf('CANT_REMOVE_OWNER') !== -1) {
            this.openSuccessDialog({ text: this.translate.instant('Cannot remove shop owner from the shop'), title: this.translate.instant('Error') }, true);
          } else if (err.message.indexOf(EnumAuthError.PERMISSION_DENIED) !== -1) {
            this.openSuccessDialog(
              { text: this.translate.instant('Only owner and admin have permission to manage this part'), title: this.translate.instant('Permission denied') },
              true,
            );
          } else {
            this.openSuccessDialog(
              {
                text: this.translate.instant(
                  'Something went wrong when trying to remove shop member, please try again later. For more information, please contact us at 02-029-1200',
                ),
                title: this.translate.instant('Error'),
              },
              true,
            );
            console.log(err);
          }
        },
      );
  }

  openConfirmRevokeByIDDialog(id: number): void {
    this.userID = id;
    this.successDialog = undefined;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    dialogRef.componentInstance.data = {
      title: this.translate.instant('Confirm Revoke'),
      text: this.translate.instant('Are you sure you want to revoke this member'),
      btnOkClick: this.revokeUserByID.bind(this),
    };
  }

  revokeUserByID(): void {
    this.pageMemberService
      .revokePageMemberByUserID(this.userID)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.openSuccessDialog({ text: this.translate.instant('Data have been revoked successfully'), title: this.translate.instant('Revoked Successfully') });
        },
        (err) => {
          if (err.message.indexOf('CANT_REVOKE_MEMBER') !== -1) {
            this.openSuccessDialog(
              {
                text:
                  // eslint-disable-next-line max-len
                  'Invited user already accept invitation. If you still want to remove this user, please refresh and try again. For more information, please contact us at 02-029-1200 ',
                title: this.translate.instant('Error'),
              },
              true,
            );
          } else if (err.message.indexOf('CANT_REMOVE_OWNER') !== -1) {
            this.openSuccessDialog({ text: this.translate.instant('Cannot remove shop owner from the shop'), title: this.translate.instant('Error') }, true);
          } else if (err.message.indexOf(EnumAuthError.PERMISSION_DENIED) !== -1) {
            this.openSuccessDialog(
              { text: this.translate.instant('Only owner and admin have permission to manage this part'), title: this.translate.instant('Permission denied') },
              true,
            );
          } else {
            this.openSuccessDialog(
              {
                text: this.translate.instant(
                  'Something went wrong when trying to revoke shop member, please try again later. For more information, please contact us at 02-029-1200',
                ),
                title: this.translate.instant('Error'),
              },
              true,
            );
            console.log(err);
          }
        },
      );
  }

  openConfirmRevokeByEmailDialog(email: string): void {
    this.userEmail = email;
    this.successDialog = undefined;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    dialogRef.componentInstance.data = {
      title: this.translate.instant('Confirm Revoke'),
      text: this.translate.instant('Are you sure you want to revoke this member'),
      btnOkClick: this.revokeUserByEmail.bind(this),
    };
  }

  revokeUserByEmail(): void {
    this.pageMemberService
      .revokePageMemberByEmail(this.userEmail)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.openSuccessDialog({ text: this.translate.instant('Data have been revoked successfully'), title: this.translate.instant('Revoked Successfully') });
        },
        (err) => {
          if (err.message.indexOf('CANT_REVOKE_MEMBER') !== -1) {
            this.openSuccessDialog(
              {
                text:
                  // eslint-disable-next-line max-len
                  'Invited user already accept invitation. If you still want to remove this user, please refresh and try again. For more information, please contact us at 02-029-1200 ',
                title: this.translate.instant('Error'),
              },
              true,
            );
          } else if (err.message.indexOf('CANT_REMOVE_OWNER') !== -1) {
            this.openSuccessDialog({ text: this.translate.instant('Cannot remove shop owner from the shop'), title: this.translate.instant('Error') }, true);
          } else if (err.message.indexOf(EnumAuthError.PERMISSION_DENIED) !== -1) {
            this.openSuccessDialog(
              { text: this.translate.instant('Only owner and admin have permission to manage this part'), title: this.translate.instant('Permission denied') },
              true,
            );
          } else {
            this.openSuccessDialog(
              {
                text: this.translate.instant(
                  'Something went wrong when trying to revoke shop member, please try again later. For more information, please contact us at 02-029-1200',
                ),
                title: this.translate.instant('Error'),
              },
              true,
            );
            console.log(err);
          }
        },
      );
  }

  trackBy(index: number, el: IPageMemberModel): number {
    return el.id;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
