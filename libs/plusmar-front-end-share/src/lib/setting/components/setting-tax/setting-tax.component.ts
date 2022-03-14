import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { ITextTitle } from '@reactor-room/model-lib';
import { TaxService } from '@reactor-room/plusmar-front-end-share/services/tax.service';
import { UserService } from '@reactor-room/plusmar-front-end-share/services/user/user.service';
import { EnumAuthError, EnumPageMemberType, ITaxIsActiveModel, ITaxModel, ITaxUpdate, ITaxUpdateIsSave } from '@reactor-room/itopplus-model-lib';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SettingTaxDialogComponent } from './components/setting-tax-dialog/setting-tax-dialog.component';

@Component({
  selector: 'reactor-room-setting-tax',
  templateUrl: './setting-tax.component.html',
  styleUrls: ['./setting-tax.component.scss'],
})
export class SettingTaxComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  successDialog;
  taxData: ITaxModel;
  isActive: boolean;
  isAllowed = false as boolean;

  constructor(private dialog: MatDialog, private taxService: TaxService, public translate: TranslateService, private userService: UserService) {}

  ngOnInit(): void {
    this.getTaxData();
    this.checkIsUserHavePermission();
  }

  checkIsUserHavePermission(): void {
    this.userService.$userPageRole.pipe(takeUntil(this.destroy$)).subscribe((userRole) => {
      if (userRole !== EnumPageMemberType.STAFF) this.isAllowed = true;
    });
  }

  getTaxData(): void {
    this.taxService
      .getTaxByPageID()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (result: ITaxModel) => {
          if (result) {
            this.taxData = result;
            this.isActive = result.status;
          } else {
            this.taxData = null;
            this.isActive = false;

            this.taxService.createTax().subscribe(() => {
              //
            });
          }
        },
        (err) => {
          this.openSuccessDialog(
            {
              text: this.translate.instant('Something went wrong when loading tax info, please try again later. For more information, please contact us at 02-029-1200'),
              title: this.translate.instant('Error'),
            },
            true,
          );
          console.log(err);
        },
      );
  }

  setActiveStatus(status: boolean): void {
    if (!status) {
      this.updateTaxStatus(status);
    } else if (this.taxData.tax_id) {
      this.updateTaxStatus(status);
    } else {
      this.isActive = status;
      this.openDialog(true);
    }
  }

  openDialog(isChangeStatus: boolean): void {
    const dialogRef = this.dialog.open(SettingTaxDialogComponent, {
      width: '100%',
      data: { tax: this.taxData, isActive: this.isActive } as ITaxIsActiveModel,
    });
    dialogRef.afterClosed().subscribe((result: ITaxUpdateIsSave) => {
      if (result && result.isSave) {
        this.updateTax(result.tax);
        if (isChangeStatus) this.isActive = true;
      } else {
        if (isChangeStatus) this.isActive = false;
      }
    });
  }

  openSuccessDialog(data: ITextTitle, isError = false): void {
    this.successDialog = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    this.successDialog.componentInstance.data = data;
    this.successDialog.componentInstance.isError = isError;
  }

  updateTax(updateTax: ITaxUpdate): void {
    const taxInputData = {
      tax_id: updateTax.taxID,
      tax: parseFloat(updateTax.taxValue),
      status: updateTax.taxStatus,
    };

    this.taxService
      .updateTax(this.taxData.id, taxInputData)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (result) => {
          if (result) {
            this.isActive = updateTax.taxStatus;
            this.openSuccessDialog({ text: this.translate.instant('Data have been saved successfully'), title: this.translate.instant('Saved Successfully') });
          }
        },
        (err) => {
          this.getTaxData();
          if (err.message.indexOf(EnumAuthError.PERMISSION_DENIED) !== -1) {
            this.openSuccessDialog(
              { text: this.translate.instant('Only owner and admin have permission to manage this part'), title: this.translate.instant('Permission denied') },
              true,
            );
          } else {
            this.openSuccessDialog(
              {
                text: this.translate.instant('Something went wrong when trying to update tax, please try. For more information, please contact us at 02-029-1200'),
                title: this.translate.instant('Error'),
              },
              true,
            );
            console.log(err);
          }
        },
      );
  }

  updateTaxStatus(status: boolean): void {
    this.taxService
      .updateTaxStatus(this.taxData.id, status)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          //
        },
        (err) => {
          this.isActive = !this.isActive;
          if (err.message.indexOf(EnumAuthError.PERMISSION_DENIED) !== -1) {
            this.openSuccessDialog(
              { text: this.translate.instant('Only owner and admin have permission to manage this part'), title: this.translate.instant('Permission denied') },
              true,
            );
          } else {
            this.openSuccessDialog(
              {
                text: this.translate.instant(
                  'Something went wrong when trying to update tax status, please try again later. For more information, please contact us at 02-029-1200',
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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
