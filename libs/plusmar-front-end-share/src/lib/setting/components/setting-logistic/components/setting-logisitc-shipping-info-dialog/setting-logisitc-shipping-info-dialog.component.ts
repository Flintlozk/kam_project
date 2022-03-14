import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EnumLogisticDeliveryProviderType } from '@reactor-room/itopplus-model-lib';

@Component({
  selector: 'reactor-room-setting-logistic-shipping-info-dialog',
  templateUrl: './setting-logisitc-shipping-info-dialog.component.html',
  styleUrls: ['./setting-logisitc-shipping-info-dialog.component.scss'],
})
export class SettingLogisticShippingInfoDialogComponent implements OnInit {
  EnumLogisticDeliveryProviderType = EnumLogisticDeliveryProviderType;
  info;
  tableData;

  infos = [
    {
      id: EnumLogisticDeliveryProviderType.THAILAND_POST,
      title: "Thailand Post's Shipping rate",
      value: 'Thaiand Post Co.',
      imgUrl: 'assets/img/logistic/thaipost_regis_info.png',
      serviceRate: 'https://www.thailandpost.co.th/un/rate_result',
    },
    {
      id: EnumLogisticDeliveryProviderType.FLASH_EXPRESS,
      title: "Flash Express's Shipping rate",
      value: 'Flash Express Co.',
      imgUrl: 'assets/img/logistic/flash_info.png',
      serviceRate: 'https://www.flashexpress.co.th/en/check-price/',
    },
    {
      id: EnumLogisticDeliveryProviderType.J_AND_T,
      title: "J&T Express's Shipping rate",
      value: 'Jet Express Co.',
      imgUrl: null,
      serviceRate: 'https://jtexpress.co.th/index/query/query.html',
    },
    {
      id: EnumLogisticDeliveryProviderType.ALPHA,
      title: "Alpha's Shipping rate",
      value: 'Alpha Performance Group Co.',
      imgUrl: null,
      serviceRate: 'https://www.alphafast.com/',
    },
  ];

  thaiPostShippingRate = [
    { weight: '<250g', same: '37', diff: '42' },
    { weight: '>250 - <500g', same: '37', diff: '42' },
    { weight: '>500 - <1,000g', same: '48', diff: '53' },
    { weight: '>1,000 - <2,000g', same: '58', diff: '63' },
    { weight: '>2,000 - <5,000g', same: '69', diff: '74' },
    { weight: '>5,000 - <10,000g', same: '90', diff: '95' },
    { weight: '>10,000 - <15,000g', same: '153', diff: '158' },
    { weight: '>15,000 - <20,000g', same: '205', diff: '210' },
  ];

  constructor(public dialogRef: MatDialogRef<SettingLogisticShippingInfoDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {
    this.info = this.infos.find((a) => a.id === this.data.logisticType);
    this.tableData = this.data.logisticType === 'THAILAND_POST' ? this.thaiPostShippingRate : [];
  }

  selectClass(): string {
    switch (this.data.logisticType) {
      case EnumLogisticDeliveryProviderType.THAILAND_POST:
        return 'thaipost';
      case EnumLogisticDeliveryProviderType.FLASH_EXPRESS:
        return 'flash';
      case EnumLogisticDeliveryProviderType.J_AND_T:
        return 'j-and-t';
      case EnumLogisticDeliveryProviderType.ALPHA:
        return 'alpha';
    }
  }
  onClose() {
    this.dialogRef.close();
  }
}
