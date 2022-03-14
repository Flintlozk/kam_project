import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ITableHeader } from '@reactor-room/plusmar-front-end-share/app.model';
import { MatDialog } from '@angular/material/dialog';
import { SettingLogisticShippingInfoDialogComponent } from './components';
import { LogisticsService } from '@reactor-room/plusmar-front-end-share/services/settings/logistics.service';
import {
  ILogisticModel,
  ILogisticFiltersInput,
  IPageFeeInfo,
  EnumPageMemberType,
  EnumLogisticDeliveryProviderType,
  EnumAuthError,
  EnumAuthScope,
} from '@reactor-room/itopplus-model-lib';
import { Subject } from 'rxjs';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk/success-dialog/success-dialog.component';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '@reactor-room/plusmar-front-end-share/services/user/user.service';
import { map, takeUntil } from 'rxjs/operators';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { SettingLogisticDeliveryDialogComponent } from './components/setting-logistic-delivery-dialog/setting-logistic-delivery-dialog.component';
import { SettingLogisticDetailDialogComponent } from './components/setting-logistic-detail-dialog/setting-logistic-detail-dialog.component';
import { SettingNewLogisticDetailDialogComponent } from './components/setting-logistic-detail-dialog/setting-new-logistic-detail-dialog/setting-new-logistic-detail-dialog.component';

@Component({
  selector: 'reactor-room-setting-logistic',
  templateUrl: './setting-logistic.component.html',
  styleUrls: ['./setting-logistic.component.scss'],
})
export class SettingLogisticComponent implements OnInit, OnDestroy {
  @Input() theme = EnumAuthScope.SOCIAL;
  themeType = EnumAuthScope;
  @Input() role: string;
  EnumLogisticDeliveryProviderType = EnumLogisticDeliveryProviderType;
  destroy$: Subject<boolean> = new Subject<boolean>();
  deleteLogisticID: number;
  successDialog;
  tableData: ILogisticModel[];
  isLoading = true as boolean;
  isNoData = false as boolean;
  isAnyActive = true as boolean;
  isClosable = true as boolean;
  isAllowed = false as boolean;
  isTryToUpdateStatus = false as boolean;

  pageFeeInfo: IPageFeeInfo = {
    delivery_fee: 0,
    flat_status: false,
  };

  tableHeader: ITableHeader[];

  tableFilters: ILogisticFiltersInput = {
    orderBy: ['id'],
    orderMethod: 'asc',
  };

  constructor(
    private deliveryFeeDialog: MatDialog,
    public translate: TranslateService,
    private logisticsService: LogisticsService,
    private dialog: MatDialog,
    private userService: UserService,
  ) {
    translate.onLangChange.subscribe(() => {
      this.setLabels();
    });
  }

  ngOnInit(): void {
    this.setLabels();
    this.getPageFlatInfo();
    this.getLogisticData();
    this.checkIsUserHavePermission();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  setLabels() {
    this.tableHeader = [
      { sort: false, title: this.translate.instant('Logistic'), key: 'name' },
      { sort: false, title: this.translate.instant('Fee calculation method'), key: 'fee_type' },
      { sort: false, title: this.translate.instant('Active'), key: null },
    ];
  }

  sortTableData(event): void {
    const { type, index } = event;
    this.tableFilters.orderBy = [this.tableHeader[index].key];
    this.tableFilters.orderMethod = type;
    this.getLogisticData();
  }

  getImageUrl(type: string): string {
    switch (type) {
      case EnumLogisticDeliveryProviderType.THAILAND_POST:
        return 'assets/img/logistic/round/ThailandPost_logo.png';
      case EnumLogisticDeliveryProviderType.EMS_THAILAND:
        return 'assets/img/logistic/round/EMS_logo.png';
      case EnumLogisticDeliveryProviderType.FLASH_EXPRESS:
        return 'assets/img/logistic/round/flashexpress_logo.png';
      case EnumLogisticDeliveryProviderType.J_AND_T:
        return 'assets/img/logistic/round/jt_logo.png';
      case EnumLogisticDeliveryProviderType.ALPHA:
        return 'assets/img/logistic/round/alpha_logo.png';
      default:
        return 'assets/img/logistic/round/custom-image.png';
    }
  }
  getLogisticName(type: string): string {
    switch (type) {
      case EnumLogisticDeliveryProviderType.THAILAND_POST:
        return 'thai-post';
      case EnumLogisticDeliveryProviderType.FLASH_EXPRESS:
        return 'flash';
      case EnumLogisticDeliveryProviderType.J_AND_T:
        return 'jt';
      case EnumLogisticDeliveryProviderType.ALPHA:
        return 'alpha';
      default:
        return '';
    }
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

  setFlatRateStatus(status): void {
    this.updatePageFlatStatus(status);
  }

  setActiveStatus(id: number, status: boolean): void {
    const isStatusUpdatable = this.checkIsUpdatable(id);
    if (isStatusUpdatable) {
      if (status || this.isClosable) {
        this.updateLogisticStatus(id, status);
      } else {
        this.openSuccessDialog({ text: this.translate.instant('The shop must have atleast 1 active logistic'), title: this.translate.instant('Error') }, true);
      }
    } else {
      const selectLogistic = this.tableData.find((x) => x.id === id);
      this.isTryToUpdateStatus = true;
      this.openLogisticDetailDialog(selectLogistic);
    }
  }

  checkIsUpdatable(id: number): boolean {
    const selectLogistic = this.tableData.find((x) => x.id === id);
    switch (selectLogistic.delivery_type) {
      // case EnumLogisticDeliveryProviderType.FLASH_EXPRESS:
      //   if (selectLogistic.option.merchant_id) return true;
      //   return false;
      // case EnumLogisticDeliveryProviderType.J_AND_T:
      //   if (selectLogistic.option.shop_id) return true;
      //   return false;
      default:
        return true;
    }
  }

  getLogisticData(): void {
    this.logisticsService
      .getLogisticsByPageID(this.tableFilters)
      .pipe(
        takeUntil(this.destroy$),
        map((logistic) => {
          return logistic.filter((item) => item.delivery_type !== EnumLogisticDeliveryProviderType.ALPHA);
        }),
      )
      .subscribe(
        (result: ILogisticModel[]) => {
          this.tableData = result;
          const active = this.tableData.filter((x) => x.status === true);
          this.isClosable = active.length > 1;
          this.isLoading = false;
        },
        (err) => {
          this.isLoading = false;
          this.isNoData = true;
          this.openSuccessDialog(
            {
              text: this.translate.instant('SOMETHING_WENT_WRONG_ON_LOADING_LOGISTIC'),
              title: this.translate.instant('Error'),
            },
            true,
          );
          console.log(err);
        },
      );
  }

  getPageFlatInfo(): void {
    this.logisticsService
      .getPageFeeInfo()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (result: IPageFeeInfo) => {
          this.pageFeeInfo = result;
        },
        () => {
          this.isLoading = false;
          this.openSuccessDialog(
            {
              text: this.translate.instant(
                'Something went wrong when loading shop flat setting info, please try again later. For more information, please contact us at 02-029-1200',
              ),
              title: this.translate.instant('Error'),
            },
            true,
          );
          console.log('err');
        },
      );
  }

  updateLogisticStatus(id: number, status: boolean): void {
    this.logisticsService
      .updateLogisticStatus(id, status)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          //
        },
        (err) => {
          if (err.message.indexOf(EnumAuthError.PERMISSION_DENIED) !== -1) {
            this.openSuccessDialog(
              { text: this.translate.instant('Only owner and admin have permission to manage this part'), title: this.translate.instant('Permission denied') },
              true,
            );
          } else {
            this.openSuccessDialog(
              {
                text: 'Something went wrong when updating logistic status, please try again later. For more information, please contact us at 02-029-1200',
                title: this.translate.instant('Error'),
              },
              true,
            );
            console.log(err);
          }
          this.isLoading = false;
        },
      );
  }

  updatePageFlatStatus(status: boolean): void {
    this.logisticsService
      .updatePageFlatStatus(status)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          //
        },
        (err) => {
          this.getPageFlatInfo();
          if (err.message.indexOf(EnumAuthError.PERMISSION_DENIED) !== -1) {
            this.openSuccessDialog(
              { text: this.translate.instant('Only owner and admin have permission to manage this part'), title: this.translate.instant('Permission denied') },
              true,
            );
          } else {
            this.openSuccessDialog(
              {
                text: this.translate.instant(
                  'Something went wrong when updating shop flat payment status, please try again later. For more information, please contact us at 02-029-1200',
                ),
                title: 'Error',
              },
              true,
            );
            console.log(err);
          }
        },
      );
  }

  updatePageDeliveryFee(fee: string): void {
    const deliveryFee = parseFloat(fee);
    this.logisticsService
      .updatePageDeliveryFee(deliveryFee)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.openSuccessDialog({ text: 'Data have been saved successfully', title: 'Saved Successfully !' });
        },
        (err) => {
          if (err.message.indexOf(EnumAuthError.PERMISSION_DENIED) !== -1) {
            this.openSuccessDialog(
              { text: this.translate.instant('Only owner and admin have permission to manage this part'), title: this.translate.instant('Permission denied') },
              true,
            );
          } else {
            this.openSuccessDialog(
              {
                text: this.translate.instant('Something went wrong when updating delivery fee, please try again later. For more information, please contact us at 02-029-1200'),
                title: this.translate.instant('Error'),
              },
              true,
            );
            console.log(err);
          }
        },
      );
  }

  openSuccessDialog(data, isError = false): void {
    this.successDialog = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    this.successDialog.componentInstance.data = data;
    this.successDialog.componentInstance.isError = isError;
    if (isError) {
      this.successDialog.afterClosed().subscribe(() => {
        this.getLogisticData();
      });
    }
  }

  openDeliveryFeeDialog(): void {
    const dialogRef = this.deliveryFeeDialog.open(SettingLogisticDeliveryDialogComponent, {
      width: isMobile() ? '90%' : '350px',
      data: this.pageFeeInfo.delivery_fee,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.isSave) {
        this.updatePageDeliveryFee(result.fee);
      }
    });
  }

  openLogisticDetailDialog(logistic: ILogisticModel): void {
    if (this.isTryToUpdateStatus) {
      logistic.status = true;
    }
    const dialogRef = this.deliveryFeeDialog.open(SettingLogisticDetailDialogComponent, {
      width: isMobile() ? '90%' : '60%',
      data: { logisticModel: logistic, theme: this.theme },
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.isTryToUpdateStatus = false;
      if (result) {
        this.openSuccessDialog({ text: this.translate.instant('Data have been saved successfully'), title: this.translate.instant('Saved Successfully') });
      } else {
        this.getLogisticData();
      }
    });
  }

  openNewLogisticDetailDialog(): void {
    const dialogRef = this.deliveryFeeDialog.open(SettingNewLogisticDetailDialogComponent, {
      width: '100%',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.openSuccessDialog({ text: this.translate.instant('Data have been saved successfully'), title: this.translate.instant('Saved Successfully') });
      }
    });
  }

  openInfoDialog(logisticType: EnumLogisticDeliveryProviderType): void {
    this.deliveryFeeDialog.open(SettingLogisticShippingInfoDialogComponent, {
      width: '100%',
      data: {
        logisticType: logisticType,
      },
    });
  }
  trackBy(index: number, el: ILogisticModel): number {
    return el.id;
  }
}
