import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'reactor-room-setting-logistic-postal-code',
  templateUrl: './setting-logistic-postal-code.component.html',
  styleUrls: ['./setting-logistic-postal-code.component.scss'],
})
export class SettingLogisticPostalCodeComponent implements OnInit {
  logisticPerItemForm: FormGroup;
  postalDeliveryArray: FormArray;
  provinceArray: FormArray;
  provinceData = [
    { provinceId: '01', provinceName: 'Bang' },
    { provinceId: '02', provinceName: 'Kok' },
    { provinceId: '03', provinceName: 'Kok Kok' },
    { provinceId: '04', provinceName: 'Bang Bang' },
  ];

  constructor(private leadFormBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.logisticPerItemForm = this.getProvinceForm();
    this.postalDeliveryArray = <FormArray>this.getPostalDeliveryFormArray();
    this.provinceArray = <FormArray>this.getProvinceFormArray();
  }

  addNewPostalDelivery(item) {
    console.log(1111, item);
    const x = <FormArray>item.controls.postalDeliveryArray;
    x.push(this.getPostalDeliveryFromGroup());
  }

  getProvinceForm(): FormGroup {
    const provinceForm = this.leadFormBuilder.group({
      provinces: this.getProvinceFormArray(),
    });
    return provinceForm;
  }

  getProvinceFormArray(): FormArray {
    const provinceFormArray = this.leadFormBuilder.array([this.getProvinceFormGroup()]);
    return provinceFormArray;
  }

  getProvinceFormGroup(): FormGroup {
    const provinceFormGroup = this.leadFormBuilder.group({
      provinceName: ['', Validators.required],
      postalDeliveryArray: this.getPostalDeliveryFormArray(),
    });
    return provinceFormGroup;
  }

  getPostalDeliveryFormArray(): FormArray {
    const postalDeliveryFormArray = this.leadFormBuilder.array([this.getPostalDeliveryFromGroup()]);
    return postalDeliveryFormArray;
  }

  getPostalDeliveryFromGroup(): FormGroup {
    const postalDeliveryFormGroup = this.leadFormBuilder.group({
      postalCode: ['', Validators.required],
      deliveryFee: ['', Validators.required],
    });
    return postalDeliveryFormGroup;
  }
}
