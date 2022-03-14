import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'reactor-room-setting-logistic-total-items',
  templateUrl: './setting-logistic-total-items.component.html',
  styleUrls: ['./setting-logistic-total-items.component.scss'],
})
export class SettingLogisticTotalItemsComponent implements OnInit {
  logisticPerItemForm: FormGroup;
  purchaseBetweenStatus = false;
  get purchaseBetweenArray(): FormArray {
    return <FormArray>this.logisticPerItemForm.get('purchaseBetweenArray');
  }

  addPurchaseBetweenArray(i: number) {
    this.purchaseBetweenArray.push(new FormControl('', Validators.required));
  }
  removePurchaseBetweenArray(i: number) {
    this.purchaseBetweenArray.removeAt(i);
  }

  constructor(private leadFormBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.logisticPerItemForm = this.leadFormBuilder.group({
      purchaseFirst: ['0', Validators.required],
      feePerItemFirst: ['฿0', Validators.required],
      purchaseMoreThan: ['0', Validators.required],
      feePerItemMore: ['฿0', Validators.required],
      purchaseBetweenStatus: [false],
      purchaseBetweenArray: new FormArray([
        this.leadFormBuilder.group({
          purchaseBetweenForm: ['0', Validators.required],
          purchaseBetweenTo: ['0', Validators.required],
          purchaseBetweenvalue: ['0', Validators.required],
        }),
      ]),
    });
  }

  setPurchaseBetweenStatus(event) {
    this.purchaseBetweenStatus = event.target.checked;
    this.logisticPerItemForm.patchValue({
      purchaseBetweenStatus: this.purchaseBetweenStatus,
    });
  }
}
