import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '@reactor-room/itopplus-cdk/confirm-dialog/confirm-dialog.component';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { ITableHeader } from '@reactor-room/plusmar-front-end-share/app.model';
import { PromotionsProductDialogComponent } from '@reactor-room/plusmar-front-end-share/promotions/components/promotions-product-dialog/promotions-product-dialog.component';

@Component({
  selector: 'reactor-room-promotions-create',
  templateUrl: './promotions-create.component.html',
  styleUrls: ['./promotions-create.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class PromotionsCreateComponent implements OnInit {
  newPromotionForm: FormGroup;

  productAmountXData = 1;

  freeProductSelected = 'Select a product';
  freeProductOptionStatus = false;

  couponData = [
    { couponId: '001', couponValue: 'CF45443' },
    { couponId: '002', couponValue: 'CF11132' },
    { couponId: '003', couponValue: 'CF45444' },
    { couponId: '004', couponValue: 'CF65655' },
    { couponId: '005', couponValue: 'CF46655' },
  ];

  productListData = [
    {
      productId: '001',
      productName: 'P01 Lorem',
      productImgURl: 'assets/img/sample-shirt.svg',
      activeStatus: false,
      productAttribute: [
        {
          id: '001SBlack',
          attribute: ['S', 'Black'],
          price: 339,
        },
        {
          id: '001SBlue',
          attribute: ['S', 'Blue'],
          price: 339,
        },
        {
          id: '001Green',
          attribute: ['S', 'Green'],
          price: 339,
        },
      ],
    },
    {
      productId: '002',
      productName: 'P02 Lorem',
      productImgURl: 'assets/img/sample-shirt.svg',
      activeStatus: false,
      productAttribute: [
        {
          id: '00214SSB',
          attribute: ['14', 'SSD'],
          price: 339,
        },
        {
          id: '00215SSB',
          attribute: ['15', 'SSD'],
          price: 339,
        },
        {
          id: '00216HHD',
          attribute: ['16', 'HDD'],
          price: 339,
        },
      ],
    },
  ];

  tableHeader: ITableHeader[] = [
    { sort: true, title: 'Products', key: null },
    { sort: true, title: 'Unit Price', key: null },
    { sort: false, title: 'Action', key: null },
  ];

  freeProductControl = new FormControl();

  promotionTypeData = [
    { type: 'discount', value: 'Discount product' },
    { type: 'xy', value: 'Buy X get Y' },
  ];
  discountTypeConditionData = [
    { condition: 'price', value: 'Discount price' },
    { condition: 'percent', value: 'Discount percent' },
    { condition: 'freeship', value: 'Offer free shipping' },
  ];

  buyXTypeConditionData = [
    { condition: 'price', value: 'Total Price' },
    { condition: 'product', value: 'Product amount' },
  ];

  getYTypeConditionData = [
    { condition: 'price', value: 'Discount price' },
    { condition: 'percent', value: 'Discount percent' },
    { condition: 'freeship', value: 'Offer free shipping' },
    { condition: 'freeproduct', value: 'Free product' },
    { condition: 'coupon', value: 'Coupon' },
  ];

  storedProductListData = this.productListData;

  constructor(private fb: FormBuilder, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.newPromotionForm = this.getPromotionFormGroup();
    console.log(this.newPromotionForm);
  }
  openPromotionsProductDialog(): void {
    const dialogRef = this.dialog.open(PromotionsProductDialogComponent, {
      width: '100%',
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  openConfirmDeleteDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    dialogRef.componentInstance.data = { title: 'Confirm Delete', text: 'Are you sure you want to delete this items ?' };
  }

  toggleAttributeStatus(index: number) {
    this.productListData[index].activeStatus = !this.productListData[index].activeStatus;
  }

  setFreeProductId(productItemIndex, AttributeIndex: number) {
    const freeProductId = this.newPromotionForm.get('promotionCondition').get('yCondition').get('yData').get('freeProductId');
    freeProductId.patchValue(this.storedProductListData[productItemIndex].productAttribute[AttributeIndex].id);
    const currentProductAttribute = this.storedProductListData[productItemIndex].productAttribute[AttributeIndex].attribute.join(' : ');
    this.freeProductSelected = this.storedProductListData[productItemIndex].productName + '_' + currentProductAttribute;
    this.freeProductOptionStatus = false;
  }

  clickOutsideProductListEvent(event: boolean) {
    if (event) {
      this.freeProductOptionStatus = false;
    } else this.freeProductOptionStatus = true;
  }

  productStoredListDataFilter(event: any) {
    this.getFilteredProductData(event.target.value);
  }

  getFilteredProductData(name: string) {
    this.storedProductListData = this.productListData;
    const filterData = this.storedProductListData.filter((product) => product.productName.toLowerCase().indexOf(name.toLowerCase()) >= 0);
    this.storedProductListData = filterData;
  }

  productAmountXDataMinus() {
    const productAmount = this.newPromotionForm.get('promotionCondition').get('xCondition').get('xData').get('productAmount');
    while (this.productAmountXData > 1) {
      this.productAmountXData--;
      break;
    }
    productAmount.patchValue(this.productAmountXData);
  }

  productAmountXDataAdd() {
    const productAmount = this.newPromotionForm.get('promotionCondition').get('xCondition').get('xData').get('productAmount');
    this.productAmountXData++;
    productAmount.patchValue(this.productAmountXData);
  }

  setDiscountType(event: any) {
    const discountType = this.newPromotionForm.get('discountType') as FormGroup;
    if (event.value === 'discount') {
      this.newPromotionForm.removeControl('promotionCondition');
      this.newPromotionForm.addControl('promotionCondition', this.getPromotionConditionFormGroup());
    } else if (event.value === 'xy') {
      this.newPromotionForm.removeControl('promotionCondition');
      this.newPromotionForm.addControl('promotionCondition', this.getXYCondition());
    }
  }
  setYTypeCondition(event: any) {
    const yTypeCondition = this.newPromotionForm.get('promotionCondition').get('yCondition') as FormGroup;
    if (event.value === 'price') {
      yTypeCondition.removeControl('yData');
      yTypeCondition.addControl('yData', this.getYPriceCondition());
    } else if (event.value === 'percent') {
      yTypeCondition.removeControl('yData');
      yTypeCondition.addControl('yData', this.getYPercentCondition());
    } else if (event.value === 'freeship') {
      yTypeCondition.removeControl('yData');
    } else if (event.value === 'freeproduct') {
      yTypeCondition.removeControl('yData');
      yTypeCondition.addControl('yData', this.getYFreeProductCondition());
    } else if (event.value === 'coupon') {
      yTypeCondition.removeControl('yData');
      yTypeCondition.addControl('yData', this.getYCouponCondition());
    }
  }

  setXTypeCondition(event: any) {
    const xTypeCondition = this.newPromotionForm.get('promotionCondition').get('xCondition') as FormGroup;
    if (event.value === 'price') {
      xTypeCondition.removeControl('xData');
      xTypeCondition.addControl('xData', this.getXPriceCondition());
    } else if (event.value === 'product') {
      xTypeCondition.removeControl('xData');
      xTypeCondition.addControl('xData', this.getXProductCondition());
    }
  }

  setDiscountCondition(event: any) {
    const promotionCondition = this.newPromotionForm.get('promotionCondition') as FormGroup;
    if (event.value === 'price') {
      promotionCondition.removeControl('discountCondition');
      promotionCondition.addControl('discountCondition', this.getDiscountPriceCondition());
    } else if (event.value === 'percent') {
      promotionCondition.removeControl('discountCondition');
      promotionCondition.addControl('discountCondition', this.getDiscountPercentCondition());
    } else if (event.value === 'freeship') {
      promotionCondition.removeControl('discountCondition');
    }
  }

  getPromotionFormGroup(): FormGroup {
    const promotionFormGroup = this.fb.group({
      discountType: [this.promotionTypeData[0].type, Validators.required],
      promotionName: ['', Validators.required],
      start: this.fb.group({
        startDate: ['', Validators.required],
        startTime: ['00:00', Validators.required],
      }),
      end: this.fb.group({
        endDate: ['', Validators.required],
        endTime: ['00:00', Validators.required],
      }),
      condition: this.getConditionFormGroup(),
      promotionCondition: this.getPromotionConditionFormGroup(),
    });
    return promotionFormGroup;
  }

  getConditionFormGroup(): FormGroup {
    const conditionFormGroup = this.fb.group({
      couponCode: ['', Validators.required],
      minPurchase: ['0.00', Validators.required],
      limitCoupons: ['', Validators.required],
      couponPerPerson: ['', Validators.required],
    });
    return conditionFormGroup;
  }

  getPromotionConditionFormGroup(): FormGroup {
    const promotionConditionFormGroup = this.fb.group({
      discountTypeCondition: [this.discountTypeConditionData[0].condition, Validators.required],
      discountCondition: this.getDiscountPriceCondition(),
    });
    return promotionConditionFormGroup;
  }

  getDiscountPriceCondition(): FormGroup {
    const discountPriceCondition = this.fb.group({
      discountPrice: ['0.00', Validators.required],
    });
    return discountPriceCondition;
  }

  getDiscountPercentCondition(): FormGroup {
    const discountPercentCondition = this.fb.group({
      discountPercent: ['0.00', Validators.required],
    });
    return discountPercentCondition;
  }

  getXYCondition(): FormGroup {
    const xyCondition = this.fb.group({
      xCondition: this.getXCondition(),
      yCondition: this.getYCondition(),
    });
    return xyCondition;
  }

  getXCondition(): FormGroup {
    const xPriceCondition = this.fb.group({
      xType: [this.buyXTypeConditionData[0].condition, Validators.required],
      xData: this.getXPriceCondition(),
    });
    return xPriceCondition;
  }

  getXPriceCondition(): FormGroup {
    const xProductCondition = this.fb.group({
      priceAmount: ['0.00', Validators.required],
    });
    return xProductCondition;
  }

  getXProductCondition(): FormGroup {
    const xProductCondition = this.fb.group({
      productAmount: [1, Validators.required],
    });
    return xProductCondition;
  }

  getYCondition(): FormGroup {
    const yCondition = this.fb.group({
      yType: [this.buyXTypeConditionData[0].condition, Validators.required],
      yData: this.getYPriceCondition(),
    });
    return yCondition;
  }

  getYPriceCondition(): FormGroup {
    const yPriceCondition = this.fb.group({
      discountPrice: ['0.00', Validators.required],
    });
    return yPriceCondition;
  }
  getYPercentCondition(): FormGroup {
    const yPercentCondition = this.fb.group({
      discountPercent: ['0.00', Validators.required],
    });
    return yPercentCondition;
  }
  getYFreeProductCondition(): FormGroup {
    const yFreeProductCondition = this.fb.group({
      freeProductId: [null, Validators.required],
    });
    return yFreeProductCondition;
  }
  getYCouponCondition(): FormGroup {
    const yCouponCondition = this.fb.group({
      couponId: [null, Validators.required],
    });
    return yCouponCondition;
  }
  trackBy(index: number, el: any): number {
    return el.id;
  }
}
