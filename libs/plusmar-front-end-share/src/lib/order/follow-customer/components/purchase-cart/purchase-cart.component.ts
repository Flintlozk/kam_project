import { ChangeDetectorRef, Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { NotifyParentService } from '@reactor-room/plusmar-front-end-share/order/audience/notify-parent.service';
import { PromotionsProductDialogComponent } from '@reactor-room/plusmar-front-end-share/promotions/components/promotions-product-dialog/promotions-product-dialog.component';
import { DialogService } from '@reactor-room/plusmar-front-end-share/services/dialog.service';
import { deepCopy } from '@reactor-room/itopplus-front-end-helpers';
import { AudiencePlatformType } from '@reactor-room/model-lib';
import {
  AudienceChatResolver,
  AudienceContactResolver,
  AudienceViewType,
  EnumPaymentType,
  EnumPurchaseOrderStatus,
  GenericButtonMode,
  GenericDialogMode,
  PaperType,
  ProductCartCaution,
  PurchaseOrderProducts,
  ShopsProductVariantList,
  TempFromGroupProductCart,
  UpdatePurchaseOrder,
} from '@reactor-room/itopplus-model-lib';
import { isEmpty } from 'lodash';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PurchaseOrderService } from '@reactor-room/plusmar-front-end-share/services/purchase-order/purchase-order.service';
import { OrderService } from '../../services/order.service';
import { LayoutCommonService } from '@reactor-room/plusmar-front-end-share/services/layout-common.service';
import { slideInOutAnimation } from '@reactor-room/plusmar-front-end-share/order/animation';

@Component({
  selector: 'reactor-room-purchase-cart',
  templateUrl: './purchase-cart.component.html',
  styleUrls: ['./purchase-cart.component.scss'],
  animations: [slideInOutAnimation],
})
export class PurchaseCartComponent implements OnInit, OnChanges, OnDestroy {
  EnumPaymentType = EnumPaymentType;
  EnumPurchaseOrderStatus = EnumPurchaseOrderStatus;
  EnumPaperType = PaperType;

  parentRouteResolver$ = this.route.parent.data as Observable<AudienceContactResolver>;
  childRouteResolver$ = this.route.data as Observable<AudienceChatResolver>;
  collapsed = false;
  freeShipping = false;
  instance = false;

  destroy$: Subject<boolean> = new Subject<boolean>();

  originRoute: AudienceViewType;
  autoModeDefination = '\n Yes: ร้านดำเนินการแทนลูกค้า\n No: ลูกค้าสามารถเลือกการจัดส่งและช่องทางการจ่ายเงินได้เอง';
  @Input() productVariants: ShopsProductVariantList[];
  constructor(
    public notifyParent: NotifyParentService,
    public route: ActivatedRoute,
    public purchaseOrderService: PurchaseOrderService,
    private matDialog: MatDialog,
    public activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private cd: ChangeDetectorRef,
    public orderService: OrderService,
    private dialogService: DialogService,
    public translate: TranslateService,
    public layoutCommonService: LayoutCommonService,
  ) {}

  // Component Life Cycle Section : Start

  ngOnInit(): void {
    this.instance = true;

    this.destroy$ = new Subject<boolean>();
    this.orderService.destroy$ = new Subject<boolean>();
    this.orderService.orderInfo = this.orderService.setFormGroup();

    // this.orderService.orderInfoHistory = this.setFormGroup(); // NOTE : FOR UNDO CART
    this.parentRouteResolver$.pipe(takeUntil(this.destroy$), takeUntil(this.orderService.destroy$)).subscribe((val) => {
      this.orderService.isLoading = true;
      this.handleData(val as AudienceChatResolver);
    });

    this.notifyParent.summaryCollapsedState.pipe(takeUntil(this.destroy$)).subscribe((res) => (this.collapsed = res));
  }

  ngOnChanges(): void {
    if (this.instance) {
      this.cd.detectChanges();
    }
  }

  ngOnDestroy(): void {
    this.instance = false;
    this.destroySubscription();
  }

  // Component Life Cycle Section : End

  handleData({ audience, route }: AudienceChatResolver): void {
    this.originRoute = route;
    if (this.orderService.audience) this.onAudienceChanged();

    this.orderService.orderInfo = this.orderService.setFormGroup();
    this.orderService.audience = audience;
    this.orderService.orderInfo.controls['audienceId'].setValue(audience.id);
    this.orderService.initAudiencesOrder();
  }

  onAudienceChanged(): void {
    this.orderService.isProcessing = true;
    // this.layoutCommonService.toggleUILoader.next(this.orderService.isProcessing);

    this.orderService.isPaid = false; //
    this.orderService.isAutomate = undefined;
    this.orderService.initUpdate = undefined;
    this.orderService.customerDetail = undefined; //
    this.orderService.paymentDetail = undefined; //
    this.orderService.shippingDetail = undefined; //
    this.orderService.deliveryFee = undefined; //
    this.orderService.flatRate = undefined; //

    this.orderService.orderId = undefined; //
    this.orderService.uuid = undefined; //

    this.orderService.orderInfoHistory = undefined;
    this.orderService.customStepLabel = undefined;
    this.orderService.stepIndex = undefined;
    this.orderService.currentStatus = undefined;
    this.orderService.isInsufficientSupply = undefined;
    this.orderService.isPipelineError = undefined;
    this.orderService.isStepPrevented = undefined;
    this.purchaseOrderService.updatePaymentSelected.next('');
  }

  destroySubscription(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();

    this.orderService.destroy$.next(null);
    this.orderService.destroy$.unsubscribe();

    this.orderService.subscriptionDestroyer$.next(null);
    this.orderService.subscriptionDestroyer$.unsubscribe();
  }

  addNewProduct(): void {
    this.matDialog
      .open(PromotionsProductDialogComponent, {
        width: '100%',
        data: null,
      })
      .afterClosed()
      .subscribe((variants: TempFromGroupProductCart[]) => {
        if (variants) {
          this.mappingProduct(variants);
        }
      });
  }

  mappingProduct(variants: TempFromGroupProductCart[]): void {
    const productIdsForUpdateInventory = [];
    const products = this.orderService.orderInfo.controls.products as FormArray;
    const currentCart = products.value;

    variants.map((variant) => {
      const found = currentCart.find((val) => val.variantId === variant.variantId[0]); // Check Variants are already added to cart
      if (found) {
        const productController = products.controls.find((product) => product.value.variantId === found.variantId) as FormGroup;
        const limitOfVariant = this.orderService.productInvertoryLimit.filter((item) => item.id === found.variantId);
        const newAmount = variant.quantity[0] + productController.value.quantity;

        if (limitOfVariant.length) {
          if (newAmount > limitOfVariant[0].inventory) {
            productController.controls['quantity'].patchValue(limitOfVariant[0].inventory);
            productController.controls['caution'].setValue([ProductCartCaution.MAX_REACH]);
          } else {
            productController.controls['quantity'].patchValue(newAmount);
            this.orderService.initUpdate = true;
          }
        } else {
          productController.controls['quantity'].patchValue(newAmount);
          this.orderService.initUpdate = true;
        }
      } else {
        variant['caution'] = ['']; // alert for each product
        variant['stock'] = 0; // inventory for each product
        variant['inventory'] = 0; // inventory for each product
        products.push(this.formBuilder.group(variant));
        this.orderService.initUpdate = true;
      }
      productIdsForUpdateInventory.push(...variant.variantId);
    });
    this.orderService.updateVariantsInventoryLimitsOnAddingProduct(productIdsForUpdateInventory);
  }

  updatePurchaseCart(): void {
    const products = this.orderService.orderInfo.controls['products'] as FormArray;
    if (products.length > 0) {
      this.orderService.isLoading = true;
      this.orderService.isProcessing = true;

      const orderInfoValue: UpdatePurchaseOrder = deepCopy(this.orderService.orderInfo.value);
      orderInfoValue.platform = this.orderService.audience.platform === null ? AudiencePlatformType.FACEBOOKFANPAGE : this.orderService.audience.platform;
      orderInfoValue.products.map((item) => {
        delete item.images;
        delete item.productImage;
      });

      this.purchaseOrderService.updatePurchaseOrder(orderInfoValue).subscribe(
        () => {
          this.orderService.initUpdate = false;
          this.orderService.initAudiencesOrder();
        },
        (err) => {
          this.dialogService.openDialog(err.message, GenericDialogMode.CAUTION, GenericButtonMode.CLOSE).subscribe();
          this.orderService.isLoading = false;
          this.orderService.isProcessing = false;
        },
      );
    } else {
      this.orderService.alertAddingProduct();
    }
  }

  getFilterProductIncart(varaintID: number): PurchaseOrderProducts {
    if (!isEmpty(this.orderService.currentProducts)) {
      const variant = this.orderService.currentProducts.find((item) => item.variantId === varaintID);
      if (!isEmpty(variant)) return variant;
    }

    return { quantity: 0 } as PurchaseOrderProducts;
  }

  onInputProductAmount(product: FormGroup): void {
    const target = 'quantity';
    const filter = this.orderService.productInvertoryLimit.find((item) => item.id === product.value['variantId']);
    const filterProduct = this.getFilterProductIncart(product.value['variantId']);

    let stock = filter.inventory;
    if (this.orderService.stepIndex === this.orderService.stepThree) stock = filter.inventory + filterProduct.quantity;

    this.orderService.initUpdate = true;
    if (product.value[target] >= stock) {
      product.controls[target].setValue(stock);
    } else if (product.value[target] <= 1) {
      setTimeout(() => {
        if (product.value[target] < 1) product.controls[target].setValue(1);
      }, 500);
    }
  }

  minusFunc(product: FormGroup): void {
    const target = 'quantity';
    if (product.value[target] > 1) {
      this.orderService.initUpdate = true;
      product.value[target]--;
      product.controls[target].setValue(product.value[target]);
    }
  }

  plusFunc(product: FormGroup): void {
    const filter = this.orderService.productInvertoryLimit.find((item) => item.id === product.value['variantId']);
    const filterProduct = this.getFilterProductIncart(product.value['variantId']);

    let stock = filter.inventory;
    if (this.orderService.stepIndex === this.orderService.stepThree) stock = filter.inventory + filterProduct.quantity;

    const target = 'quantity';
    if (product.value[target] >= 0 && product.value[target] < stock) {
      this.orderService.initUpdate = true;
      product.value[target]++;
      product.controls[target].setValue(product.value[target]);

      if (product.value[target] >= stock) {
        product.controls[target].setValue(stock);
      }
    }
  }

  removeProduct(productIndex: number): void {
    const products = this.orderService.orderInfo.controls.products as FormArray;
    if (products.length > 1) {
      this.orderService.initUpdate = true;
      products.removeAt(productIndex);
      products.setValue(products.value);
    }
  }

  openProductList(): void {
    void this.router.navigate(['/products/list/1']);
  }

  enabledAutoOrder(bool: boolean): void {
    // TODO : to TRUE ask confirm popup
    if (this.orderService.isAutomate !== bool) this.orderService.initUpdate = true;
    this.orderService.isAutomate = bool;
    this.orderService.orderInfo.controls['isAuto'].patchValue(bool);
  }
}
