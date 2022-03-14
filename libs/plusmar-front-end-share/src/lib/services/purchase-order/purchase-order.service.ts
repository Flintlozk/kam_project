import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Injectable, OnDestroy } from '@angular/core';
import {
  IPurchaseOrder,
  OrderFilters,
  PurchaseOrderList,
  PurchaseOrderResponse,
  PurchaseOrderStats,
  TrackingNoInput,
  UpdatePurchaseOrder,
  UpdatePurchasePaymentInput,
  PurchaseInventory,
  UpdatePurchasePaymentMode,
  IPurchaseOrderSubscription,
  PurchaseOrderCustomerDetail,
  IPurchaseOrderPaymentDetail,
  PurchaseOrderShippingDetail,
  CustomerAddressFromGroup,
  IPurchaseOrerErrors,
  EnumPurchaseOrderSubStatus,
  IPurhcaseOrderPayment,
  EnumPaymentType,
} from '@reactor-room/itopplus-model-lib';

import { Observable, Subject, ReplaySubject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import {
  GET_PURCHASE_ORDER,
  GET_PURCHASE_ORDER_FAILED_HISTORY,
  GET_PURCHASE_ORDER_PAYMENT_DETAIL,
  GET_PURCHASE_ORDER_SHIPPING_DETAIL,
  GET_PURCHASE_ORDER_SUBSCRIPTION,
  GET_PURCHASE_ORDER_UNREFUNDED_PAYMENT_INFO,
} from './purchase-order.query';
import { FormGroup } from '@angular/forms';
import { AudiencePlatformType, IHTTPResult } from '@reactor-room/model-lib';

@Injectable({
  providedIn: 'root',
})
export class PurchaseOrderService implements OnDestroy {
  orderId = new ReplaySubject<number>();
  orderInfo = new ReplaySubject<FormGroup>();
  currentStatus = new ReplaySubject<string>();
  customerDetail = new ReplaySubject<PurchaseOrderCustomerDetail>();
  paymentDetail = new ReplaySubject<IPurchaseOrderPaymentDetail>();
  shippingDetail = new ReplaySubject<PurchaseOrderShippingDetail>();
  enableConfig = new ReplaySubject<boolean>();
  stepIndex = new ReplaySubject<number>();

  unFixedList = new Subject<IPurchaseOrerErrors[]>();
  updateHandling = new Subject<boolean>();
  openPaymentShippingInfo = new Subject<string>();
  toggleOrderDetail = new Subject<boolean>();
  toggleTracking = new Subject<boolean>();
  updateLogisticSelected = new Subject<boolean>();
  updatePaymentSelected = new Subject<string>();
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private apollo: Apollo) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
  getPurchaseOrder(audienceId: number, currentStatus: string): Observable<IPurchaseOrder> {
    return this.apollo
      .watchQuery({
        query: GET_PURCHASE_ORDER,
        variables: {
          audienceId,
          currentStatus,
        },
        fetchPolicy: 'no-cache',
      })
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getPurchaseOrder']),
      );
  }
  getPurchaseOrderShippingDetail(orderId: number, audienceId: number): Observable<PurchaseOrderShippingDetail> {
    return this.apollo
      .watchQuery({
        query: GET_PURCHASE_ORDER_SHIPPING_DETAIL,
        variables: {
          orderId,
          audienceId,
        },
        fetchPolicy: 'no-cache',
      })
      .valueChanges.pipe(map((x) => x.data['getPurchaseOrderShippingDetail']));
  }
  getPurchaseOrderPaymentDetail(orderId: number, audienceId: number): Observable<IPurchaseOrderPaymentDetail> {
    return this.apollo
      .watchQuery({
        query: GET_PURCHASE_ORDER_PAYMENT_DETAIL,
        variables: {
          orderId,
          audienceId,
        },
        fetchPolicy: 'no-cache',
      })
      .valueChanges.pipe(map((x) => x.data['getPurchaseOrderPaymentDetail']));
  }
  getPurchaseOrderFailedHistory(audienceID: number, orderID: number): Observable<IPurchaseOrerErrors[]> {
    return this.apollo
      .watchQuery({
        query: GET_PURCHASE_ORDER_FAILED_HISTORY,
        variables: {
          audienceID,
          orderID,
        },
        fetchPolicy: 'no-cache',
      })
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getPurchaseOrderFailedHistory'] as IPurchaseOrerErrors[]),
      );
  }
  getPurchasingOrderUnrefundedPaymentInfo(orderID: number): Observable<IPurhcaseOrderPayment[]> {
    return this.apollo
      .watchQuery({
        query: GET_PURCHASE_ORDER_UNREFUNDED_PAYMENT_INFO,
        variables: {
          orderID,
        },
        fetchPolicy: 'no-cache',
      })
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getPurchasingOrderUnrefundedPaymentInfo'] as IPurhcaseOrderPayment[]),
      );
  }
  getPurchaseOrderSubscription(audienceId: number, orderId: number): Observable<IPurchaseOrderSubscription> {
    return this.apollo
      .subscribe({
        query: GET_PURCHASE_ORDER_SUBSCRIPTION,
        variables: {
          audienceID: audienceId,
          orderID: orderId,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getPurchaseOrderSubscription']),
      );
  }

  getCurrentPurchaseProductInventory(orderId: number, productIds: number[]): Observable<PurchaseInventory[]> {
    const query = gql`
      query getCurrentPurchaseProductInventory($orderId: Int, $productIds: [Int]) {
        getCurrentPurchaseProductInventory(orderId: $orderId, productIds: $productIds) {
          id
          stock
          inventory
        }
      }
    `;
    return this.apollo
      .query({
        query,
        variables: {
          orderId,
          productIds,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getCurrentPurchaseProductInventory']),
      );
  }

  getPurchaseOrderList(filters: OrderFilters): Observable<PurchaseOrderList[]> {
    const query = gql`
      query getPurchaseOrderList($filters: POFilters) {
        getPurchaseOrderList(filters: $filters) {
          customerId
          audienceId
          orderNo
          createdOrder
          customerName
          customerImgUrl
          totalPrice
          status
          totalrows
          delivery_type
          tracking_url
          shipping_date
          tracking_no
          customerPlatform
        }
      }
    `;
    return this.apollo
      .query({
        query,
        variables: {
          filters,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getPurchaseOrderList']),
      );
  }

  getAllPOInMonth(): Observable<IPurchaseOrder[]> {
    const query = gql`
      query getAllPOInMonth {
        getAllPOInMonth {
          id
        }
      }
    `;
    return this.apollo
      .query({
        query,
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getAllPOInMonth']),
      );
  }

  retryCreateOrderTracking(audienceID: number, orderID: number): Observable<PurchaseOrderResponse> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation retryCreateOrderTracking($audienceID: Int, $orderID: Int) {
            retryCreateOrderTracking(audienceID: $audienceID, orderID: $orderID) {
              status
              message
            }
          }
        `,
        variables: { audienceID, orderID },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['retryCreateOrderTracking']),
      );
  }
  resolvePurchaseOrderProblem(audienceID: number, orderID: number, typename: EnumPurchaseOrderSubStatus): Observable<PurchaseOrderResponse> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation resolvePurchaseOrderProblem($audienceID: Int, $orderID: Int, $typename: EnumPurchaseOrderSubStatus) {
            resolvePurchaseOrderProblem(audienceID: $audienceID, orderID: $orderID, typename: $typename) {
              status
              message
            }
          }
        `,
        variables: { audienceID, orderID, typename },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['resolvePurchaseOrderProblem']),
      );
  }
  proceedToRefundOrder(orderID: number): Observable<PurchaseOrderResponse> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation proceedToRefundOrder($orderID: Int) {
            proceedToRefundOrder(orderID: $orderID) {
              status
              message
            }
          }
        `,
        variables: { orderID },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['proceedToRefundOrder']),
      );
  }
  updatePurchaseOrder(order: UpdatePurchaseOrder): Observable<PurchaseOrderResponse> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation updatePurchaseOrder($order: UpdatePurchaseOrderInput) {
            updatePurchaseOrder(order: $order) {
              status
              message
            }
          }
        `,
        variables: { order: { orderId: order.orderId, audienceId: order.audienceId, products: order.products, isAuto: order.isAuto, platform: order.platform } },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updatePurchaseOrder']),
      );
  }

  updatePurchasePayment(payment: UpdatePurchasePaymentInput, mode: UpdatePurchasePaymentMode): Observable<PurchaseOrderResponse> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation updatePurchasePayment($payment: UpdatePurchasePaymentInput, $mode: UpdatePurchasePaymentMode) {
            updatePurchasePayment(payment: $payment, mode: $mode) {
              status
              message
            }
          }
        `,
        variables: { payment, mode },
        context: {
          useMultipart: true,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updatePurchasePayment']),
      );
  }

  updateShippingAddress(orderID: number, audienceID: number, shippingAddress: CustomerAddressFromGroup): Observable<PurchaseOrderResponse> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation updateShippingAddress($orderID: Int, $audienceID: Int, $shippingAddress: UpdateShippingAddress) {
            updateShippingAddress(orderID: $orderID, audienceID: $audienceID, shippingAddress: $shippingAddress) {
              status
              value
              expiresAt
            }
          }
        `,
        variables: { orderID, audienceID, shippingAddress },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updateShippingAddress']),
      );
  }

  updateSelectedLogisticMethod(audienceID: number, logisticID: number): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation updateSelectedLogisticMethod($audienceID: Int, $logisticID: Int) {
            updateSelectedLogisticMethod(audienceID: $audienceID, logisticID: $logisticID) {
              status
              value
            }
          }
        `,
        variables: {
          audienceID,
          logisticID,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updateSelectedLogisticMethod']),
      );
  }

  updateSelectedPaymentMethod(audienceID: number, paymentID: number): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation updateSelectedPaymentMethod($audienceID: Int, $paymentID: Int) {
            updateSelectedPaymentMethod(audienceID: $audienceID, paymentID: $paymentID) {
              status
              value
            }
          }
        `,
        variables: {
          audienceID,
          paymentID,
        },
      })
      .pipe(map((x) => x.data['updateSelectedPaymentMethod']));
  }

  changeOrderPayment(audienceID: number, orderID: number): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation changeOrderPayment($audienceID: Int, $orderID: Int, $changeTo: EnumPaymentType) {
            changeOrderPayment(audienceID: $audienceID, orderID: $orderID, changeTo: $changeTo) {
              status
              value
            }
          }
        `,
        variables: {
          audienceID,
          orderID,
        },
      })
      .pipe(map((x) => x.data['changeOrderPayment']));
  }

  changeOrderLogistic(audienceID: number, orderID: number, changeTo: EnumPaymentType): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation changeOrderLogistic($audienceID: Int, $orderID: Int) {
            changeOrderLogistic(audienceID: $audienceID, orderID: $orderID) {
              status
              value
            }
          }
        `,
        variables: {
          audienceID,
          orderID,
          changeTo,
        },
      })
      .pipe(map((x) => x.data['changeOrderLogistic']));
  }

  updateTrackingNumber(audienceID: number, orderID: number, tracking: TrackingNoInput, platform: AudiencePlatformType): Observable<PurchaseOrderResponse> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation updateTrackingNumber($audienceID: Int, $orderID: Int, $tracking: TrackingNoInput, $platform: String) {
            updateTrackingNumber(audienceID: $audienceID, orderID: $orderID, tracking: $tracking, platform: $platform) {
              status
              message
            }
          }
        `,
        variables: {
          audienceID,
          orderID,
          tracking,
          platform,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updateTrackingNumber']),
      );
  }

  getPoStats(filters: OrderFilters): Observable<PurchaseOrderStats> {
    const query = gql`
      query getPoStatsCounts($filters: POFilters) {
        getPoStatsCounts(filters: $filters) {
          all_po
          all_total
          follow_po
          follow_total
          waiting_payment_po
          waiting_payment_total
          confirm_po
          confirm_total
          waiting_shipment_po
          waiting_shipment_total
          close_po
          close_total
          expired_po
          reject_po
        }
      }
    `;
    return this.apollo
      .query({
        query,
        variables: {
          filters,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getPoStatsCounts']),
      );
  }
}
