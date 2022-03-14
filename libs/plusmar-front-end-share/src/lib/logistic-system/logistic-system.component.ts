import { Component, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { TranslateService } from '@ngx-translate/core';
import { SettingsService } from '@reactor-room/plusmar-front-end-share/services/settings/setting.service';
import {
  EnumAuthScope,
  EnumLogisticDeliveryProviderType,
  EnumLogisticSystemType,
  IPageLogisticSystemOptionFixedRate,
  IPageLogisticSystemOptionFlatRate,
  IPageLogisticSystemOptionPricingTable,
  IPageLogisticSystemOptions,
  PageSettingType,
} from '@reactor-room/itopplus-model-lib';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { LogisticSystemService } from './logistic-system.service';
import { SettingLogisticShippingInfoDialogComponent } from '@reactor-room/plusmar-front-end-share/setting/components/setting-logistic/components';

@Component({
  selector: 'reactor-room-logistic-system',
  templateUrl: './logistic-system.component.html',
  styleUrls: ['./logistic-system.component.scss'],
})
export class LogisticSystemComponent implements OnInit, OnDestroy {
  @Input() logisticSystem: IPageLogisticSystemOptions;
  @Input() subSystem = false;
  @Input() setReturnUpdate = false;
  @Input() theme: string;
  themeType = EnumAuthScope;
  @Input() deliveryType: EnumLogisticDeliveryProviderType = null;
  @Output() subSystemUpdate: Subject<IPageLogisticSystemOptions> = new Subject<IPageLogisticSystemOptions>();
  @Output() systemUpdate: Subject<IPageLogisticSystemOptions> = new Subject<IPageLogisticSystemOptions>();

  logisticSystemForm: FormGroup;
  ELogisticSystemType = EnumLogisticSystemType;

  allowRule = true;

  calculationMethodList = [
    { isAllow: true, index: 0, type: EnumLogisticSystemType.PRICING_TABLE, name: this.translate.instant('Pricing Table'), isActive: false },
    { isAllow: true, index: 1, type: EnumLogisticSystemType.FLAT_RATE, name: this.translate.instant('Flat Rate'), isActive: false },
    { isAllow: true, index: 2, type: EnumLogisticSystemType.FIXED_RATE, name: this.translate.instant('Fixed Rate'), isActive: false },
  ];

  destroy$: Subject<boolean> = new Subject<boolean>();

  isLoading = false;

  constructor(
    private toastr: ToastrService,
    private logisticSystemService: LogisticSystemService,
    public translate: TranslateService,
    private settingsService: SettingsService,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
  ) {}

  get getPricingTableControl(): AbstractControl {
    return this.logisticSystemForm.get('pricingTable');
  }
  get getFlatRateControl(): AbstractControl {
    return this.logisticSystemForm.get('flatRate');
  }
  get getFixedRateControl(): AbstractControl {
    return this.logisticSystemForm.get('fixedRate');
  }
  get getActivatedCalculationMethod(): EnumLogisticSystemType {
    return this.calculationMethodList.find((x) => x.isActive).type;
  }

  ngOnInit(): void {
    if (this.subSystem) {
      this.readFromProvidedSubSystem();
    } else {
      this.getLogisticSystemSetting();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  readFromProvidedSubSystem(): void {
    this.initLogisitcSettingForm();
    this.onSaveSettingEmitted();
  }

  getLogisticSystemSetting(): void {
    this.settingsService
      .getPageSetting(PageSettingType.LOGISTIC_SYSTEM)
      .pipe(takeUntil(this.destroy$))
      .subscribe((setting) => {
        this.logisticSystem = <IPageLogisticSystemOptions>setting.options;

        this.initLogisitcSettingForm();
        this.onSaveSettingEmitted();
      });
  }

  initLogisitcSettingForm(): void {
    //  {
    //   pricingTable: { type: 'PRICING_TABLE', isActive: false, provider: 'THAILAND_POST' },
    //   flatRate: { type: 'FLAT_RATE', isActive: true, deliveryFee: 0 },
    //   fixedRate: { type: 'FIXED_RATE', isActive: false, useMin: true, amount: 0, fallbackType: 'FLAT_RATE' },
    // };

    // pricingTable: IPageLogisticSystemOptionPricingTable;
    // flatRate: IPageLogisticSystemOptionFlatRate;
    // fixedRate: IPageLogisticSystemOptionFixedRate

    if (!this.logisticSystemForm) {
      this.logisticSystemForm = this.formBuilder.group({
        pricingTable: this.formBuilder.group(this.logisticSystem.pricingTable),
        flatRate: this.formBuilder.group(this.logisticSystem.flatRate),
        fixedRate: this.formBuilder.group(this.logisticSystem.fixedRate),
      });
    }
    const pricingTable: IPageLogisticSystemOptionPricingTable = this.getPricingTableControl.value;
    this.calculationMethodList[0].isActive = pricingTable.isActive;
    this.calculationMethodList[0].isAllow = ![EnumLogisticDeliveryProviderType.FLASH_EXPRESS, EnumLogisticDeliveryProviderType.J_AND_T].includes(this.deliveryType);

    const flatRate: IPageLogisticSystemOptionFlatRate = this.getFlatRateControl.value;
    this.calculationMethodList[1].isActive = flatRate.isActive;

    const fixedRate: IPageLogisticSystemOptionFixedRate = this.getFixedRateControl.value;
    this.calculationMethodList[2].isActive = fixedRate.isActive;
  }

  onSelectCalucationMethod(change: MatSelectChange) {
    const calculationType = <EnumLogisticSystemType>change.value;
    const settings = {
      [EnumLogisticSystemType.PRICING_TABLE]: this.getPricingTableControl,
      [EnumLogisticSystemType.FLAT_RATE]: this.getFlatRateControl,
      [EnumLogisticSystemType.FIXED_RATE]: this.getFixedRateControl,
    };
    const keys = Object.keys(settings) as EnumLogisticSystemType[];
    for (const key of keys) {
      const matchSelected = key === calculationType;
      const abstractControl = settings[key];
      abstractControl.patchValue({ ...abstractControl.value, isActive: matchSelected });
    }

    this.logisticSystemForm.markAsDirty();
    this.initLogisitcSettingForm();
  }

  onSaveSettingEmitted() {
    this.logisticSystemForm.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(300)).subscribe((changes) => {
      this.logisticSystem = changes;

      if (this.setReturnUpdate) {
        this.systemUpdate.next(this.logisticSystemForm.value);
      } else if (this.subSystem) {
        this.subSystemUpdate.next(this.logisticSystemForm.value);
      }
    });
  }

  saveLogisticSystemConfig() {
    if (this.logisticSystemForm.dirty && !this.isLoading) {
      this.isLoading = true;

      if (this.subSystem || this.setReturnUpdate) {
        // OUTPUT
        this.isLoading = false;
      } else {
        this.logisticSystemService.saveLogisticSystem(this.logisticSystemForm.value).subscribe(
          (setting) => {
            this.isLoading = false;
            this.logisticSystem = setting;
            this.toastr.success('Config has been saved successfully', 'Logistic System', { positionClass: 'toast-bottom-right' });
          },
          (err) => {
            this.toastr.error('Please try again', 'Logistic System', { positionClass: 'toast-bottom-right' });
          },
        );
      }
    }
  }

  openInfoDialog(logisticType: EnumLogisticDeliveryProviderType): void {
    this.matDialog.open(SettingLogisticShippingInfoDialogComponent, {
      width: '100%',
      data: {
        logisticType: logisticType,
      },
    });
  }
}
