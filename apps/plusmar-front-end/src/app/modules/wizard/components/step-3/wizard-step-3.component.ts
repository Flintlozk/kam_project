import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { LogisticSystemService } from '@reactor-room/plusmar-front-end-share/logistic-system/logistic-system.service';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { PagesService } from '@reactor-room/plusmar-front-end-share/services/facebook/pages/pages.service';
import { LogisticsService } from '@reactor-room/plusmar-front-end-share/services/settings/logistics.service';
import {
  EnumLogisticDeliveryProviderType,
  ILogisticFiltersInput,
  ILogisticModel,
  IPageFeeInfo,
  IPageFlatStatusWithFee,
  IPageLogisticSystemOptions,
} from '@reactor-room/itopplus-model-lib';
import { Observable, of, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { validationMessages } from '@reactor-room/plusmar-front-end-share/setting/components/setting-logistic/logistic-validation';
//import { validationMessages } from './../../../setting/components/setting-logistic/logistic-validation';

@Component({
  selector: 'reactor-room-wizard-step-3',
  templateUrl: './wizard-step-3.component.html',
  styleUrls: ['wizard-step-3.component.scss'],
})
export class WizardStepThreeComponent implements OnInit, OnDestroy {
  @Output() cancel = new EventEmitter<boolean>();
  destroy$: Subject<boolean> = new Subject<boolean>();
  isClosable = false as boolean;
  successDialog;

  logisticSystem: IPageLogisticSystemOptions;

  pageFeeInfo: IPageFeeInfo = {
    delivery_fee: 0,
    flat_status: false,
  };

  feeValidationMessage: string;
  private validationMessages = validationMessages;

  tableFilters: ILogisticFiltersInput = {
    orderBy: ['id'],
    orderMethod: 'asc',
  };
  logistics: ILogisticModel[];
  logisticFlatShippingForm: FormGroup;

  loading = true;

  constructor(
    private leadFormBuilder: FormBuilder,
    private logisticsService: LogisticsService,
    private logisticSystemService: LogisticSystemService,
    private pagesService: PagesService,
    private dialog: MatDialog,
    public translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.logisticsService
      .getPageFeeInfo()
      .pipe(
        takeUntil(this.destroy$),
        switchMap((result: IPageFeeInfo) => {
          this.pageFeeInfo = result;
          this.logisticFlatShippingForm = this.leadFormBuilder.group({
            deliveryFee: [this.pageFeeInfo.delivery_fee, [Validators.required, Validators.pattern(/^[.\d]+$/)]],
          });
          return this.logisticsService.getLogisticsByPageID(this.tableFilters);
        }),
      )
      .subscribe(
        (res) => {
          this.loading = false;
          const active = res.filter((x) => x.status === true);
          this.isClosable = active.length > 1;
          this.logistics = res;
        },
        (err) => {
          this.loading = false;
          console.log(err);
        },
      );
  }

  getLogisticData(): void {
    this.logisticsService.getLogisticsByPageID(this.tableFilters).subscribe(
      (res) => {
        const active = res.filter((x) => x.status === true);
        this.isClosable = active.length > 1;
        this.logistics = res;
      },
      (err) => {
        console.log(err);
      },
    );
  }

  onLogisticSystemUpdate(system: IPageLogisticSystemOptions): void {
    this.logisticSystem = system;
  }

  updateLogisticSystem(): Observable<IPageLogisticSystemOptions> {
    if (this.logisticSystem) {
      return this.logisticSystemService.saveLogisticSystem(this.logisticSystem).pipe(takeUntil(this.destroy$));
    } else {
      return of({} as IPageLogisticSystemOptions);
    }
  }

  updatePageFlatStatus(status: boolean): void {
    this.logisticsService
      .updatePageFlatStatus(status)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {},
        (err) => {
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
        },
      );
  }

  updateLogisticStatus(id: number, status: boolean): void {
    this.logisticsService
      .updateLogisticStatus(id, status)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {},
        (err) => {
          this.openSuccessDialog(
            {
              text: 'Something went wrong when updating logistic status, please try again later. For more information, please contact us at 02-029-1200',
              title: this.translate.instant('Error'),
            },
            true,
          );
          console.log(err);
        },
      );
  }

  eventLookUpOnFocus(controlName: string): void {
    const customerFormControl = this.logisticFlatShippingForm.get(controlName);

    if (!this.logisticFlatShippingForm.valid) {
      this.setErrorMessage(customerFormControl, controlName);
    }
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

  setActiveStatus(id: number, status: boolean): void {
    if (status || this.isClosable) {
      this.updateLogisticStatus(id, status);
    } else {
      this.openSuccessDialog({ text: this.translate.instant('The shop must have atleast 1 active logistic'), title: this.translate.instant('Error') }, true);
    }
  }

  getImageUrl(type: EnumLogisticDeliveryProviderType): string {
    switch (type) {
      case EnumLogisticDeliveryProviderType.THAILAND_POST:
        return 'assets/img/wizard/logistic/thai_post.png';
      case EnumLogisticDeliveryProviderType.FLASH_EXPRESS:
        return 'assets/img/wizard/logistic/flash.png';
      case EnumLogisticDeliveryProviderType.J_AND_T:
        return 'assets/img/wizard/logistic/j&t.png';
      case EnumLogisticDeliveryProviderType.ALPHA:
        return 'assets/img/wizard/logistic/alpha.png';
    }
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

  onSave(): void {
    const isAnyActive = this.logistics.filter((c) => c.status).length !== 0;
    const isNeedToUpdateFee = this.pageFeeInfo.flat_status;
    if (!isNeedToUpdateFee && !isAnyActive) {
      this.openSuccessDialog({ text: this.translate.instant('The shop must have atleast 1 active logistic'), title: this.translate.instant('Error') }, true);
    } else if (isNeedToUpdateFee && !this.logisticFlatShippingForm.valid) {
      this.eventLookUpOnFocus('deliveryFee');
    } else {
      const fee = isNeedToUpdateFee ? parseFloat(this.logisticFlatShippingForm.value.deliveryFee) : 0;
      const flatInput: IPageFlatStatusWithFee = {
        flatStatus: this.pageFeeInfo.flat_status,
        fee: fee,
      };

      this.updateLogisticSystem()
        .pipe(
          switchMap(() => {
            return this.pagesService.updatePageLogisticFromWizardStep(flatInput);
          }),
        )
        .subscribe(
          () => {
            window.location.reload();
          },
          (err) => {
            this.openSuccessDialog(
              {
                text: 'Something went wrong when updating logistic status, please try again later. For more information, please contact us at 02-029-1200',
                title: this.translate.instant('Error'),
              },
              true,
            );
            console.log(err);
          },
        );
      // this.pagesService.updatePageLogisticFromWizardStep(flatInput).pipe(takeUntil(this.destroy$)).subscribe;
    }
  }

  setErrorMessage(c: AbstractControl, controlName: string): void {
    if (c.errors && (c.touched || c.dirty)) {
      const validationData = this.validationMessages.find((validation) => validation.control === controlName);
      const validationRules = validationData.rules;

      const errorMessage = Object.keys(c.errors)
        .map((key) => validationRules[key])
        .join('<br>');
      this.showErrorMessage(controlName, errorMessage);
    }
  }

  showErrorMessage(controlName: string, errorMessage: string): void {
    switch (controlName) {
      case 'deliveryFee':
        this.feeValidationMessage = errorMessage;
        break;
      default:
        break;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
