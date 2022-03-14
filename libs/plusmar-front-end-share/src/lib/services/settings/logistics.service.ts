import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ILogisticModel, ILogisticModelInput, IPageFeeInfo, ILogisticFiltersInput, ICalculatedShipping, IPayOffResult } from '@reactor-room/itopplus-model-lib';
import { AudiencePlatformType, IHTTPResult } from '@reactor-room/model-lib';

@Injectable({
  providedIn: 'root',
})
export class LogisticsService {
  constructor(private ngZone: NgZone, private router: Router, private apollo: Apollo) {}

  paySingleDropOffBalance(orderID: number, platform: AudiencePlatformType): Observable<IPayOffResult> {
    return this.apollo
      .query({
        query: gql`
          query paySingleDropOffBalance($orderID: Int, $platform: String) {
            paySingleDropOffBalance(orderID: $orderID, platform: $platform) {
              isSuccess
              message
              orderID
              aliasOrderId
              remainingCredit
              totalPrice
              trackingNo
            }
          }
        `,
        variables: {
          orderID,
          platform,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe<IPayOffResult>(map((response) => response.data['paySingleDropOffBalance']));
  }
  calculateShippingPrice(orderIDs: number[]): Observable<ICalculatedShipping> {
    return this.apollo
      .query({
        query: gql`
          query calculateShippingPrice($orderIDs: [Int]) {
            calculateShippingPrice(orderIDs: $orderIDs) {
              orders {
                orderID
                aliasOrderId
                weight
                weightRange
                price
              }
              totalPrice
              isAfford
            }
          }
        `,
        variables: {
          orderIDs,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe<ICalculatedShipping>(map((response) => response.data['calculateShippingPrice']));
  }

  getLogisticPageLogisticSettings(): Observable<ILogisticModel[]> {
    return this.apollo
      .query({
        query: gql`
          query getLogisticPageLogisticSettings {
            getLogisticPageLogisticSettings {
              id
              name
              type
              fee_type
              delivery_type
              cod_status
              delivery_fee
              image
              country
              tracking_url
              delivery_days
              status
              tracking_type
              sub_system {
                pricingTable {
                  type
                  isActive
                  provider
                }
                flatRate {
                  type
                  isActive
                  deliveryFee
                }
                fixedRate {
                  type
                  isActive
                  useMin
                  amount
                  fallbackType
                }
              }
              option {
                type
                ... on FlashExpressConfig {
                  wallet_id
                  merchant_id
                }
                ... on JAndTConfig {
                  shop_name
                  shop_id
                }
                ... on AlphaFastConfig {
                  merchant_id
                }
              }
            }
          }
        `,
        fetchPolicy: 'no-cache',
      })
      .pipe<ILogisticModel[]>(map((response) => response.data['getLogisticPageLogisticSettings']));
  }

  getLogisticsByPageID(filters: ILogisticFiltersInput): Observable<ILogisticModel[]> {
    const result = this.apollo
      .watchQuery({
        query: gql`
          query getLogisticsByPageID($filters: LogisticFiltersInput) {
            getLogisticsByPageID(filters: $filters) {
              id
              name
              type
              fee_type
              delivery_type
              cod_status
              delivery_fee
              image
              country
              tracking_url
              delivery_days
              status
              tracking_type
              wallet_id
              sub_system {
                pricingTable {
                  type
                  isActive
                  provider
                }
                flatRate {
                  type
                  isActive
                  deliveryFee
                }
                fixedRate {
                  type
                  isActive
                  useMin
                  amount
                  fallbackType
                }
              }
              option {
                type
                ... on FlashExpressConfig {
                  merchant_id
                }
                ... on JAndTConfig {
                  shop_id
                  shop_name
                  registered
                }
                ... on AlphaFastConfig {
                  merchant_id
                }
              }
              logisticLotNumbers {
                ... on LotNumberModel {
                  id
                  logistic_id
                  suffix
                  prefix
                  from
                  to
                  is_active
                  is_remaining
                  is_expired
                  remaining
                  latest_used_number
                  created_at
                  expired_at
                }
              }
            }
          }
        `,
        variables: {
          filters: filters,
        },
        fetchPolicy: 'no-cache',
      })
      .valueChanges.pipe<ILogisticModel[]>(map((x) => x.data['getLogisticsByPageID']));
    return result;
  }

  getPageFeeInfo(): Observable<IPageFeeInfo> {
    const result = this.apollo
      .watchQuery({
        query: gql`
          query getPageFeeInfo {
            getPageFeeInfo {
              flat_status
              delivery_fee
            }
          }
        `,
        fetchPolicy: 'no-cache',
      })
      .valueChanges.pipe<IPageFeeInfo>(map((x) => x.data['getPageFeeInfo']));
    return result;
  }

  createLogistic(logisticInputData: ILogisticModelInput): Observable<IHTTPResult> {
    const result = this.apollo
      .mutate({
        mutation: gql`
          mutation createLogistic($logisticInputData: LogisticModelInput) {
            createLogistic(logisticInputData: $logisticInputData) {
              status
            }
          }
        `,
        variables: {
          logisticInputData: logisticInputData,
        },
        refetchQueries: ['getLogisticsByPageID'],
      })
      .pipe<IHTTPResult>(map((x) => x.data['createLogistic']));
    return result;
  }

  updateLogistic(id: number, logisticInputData: ILogisticModelInput): Observable<IHTTPResult> {
    const result = this.apollo
      .mutate({
        mutation: gql`
          mutation updateLogistic($id: Int, $logisticInputData: LogisticModelInput) {
            updateLogistic(id: $id, logisticInputData: $logisticInputData) {
              status
            }
          }
        `,
        variables: {
          id: id,
          logisticInputData: logisticInputData,
        },
        refetchQueries: ['getLogisticsByPageID'],
      })
      .pipe<IHTTPResult>(map((x) => x.data['updateLogistic']));
    return result;
  }

  updateLogisticStatus(id: number, status: boolean): Observable<IHTTPResult> {
    const result = this.apollo
      .mutate({
        mutation: gql`
          mutation updateLogisticStatus($id: Int, $status: Boolean) {
            updateLogisticStatus(id: $id, status: $status) {
              status
            }
          }
        `,
        variables: {
          id: id,
          status: status,
        },
        refetchQueries: ['getLogisticsByPageID'],
      })
      .pipe<IHTTPResult>(map((x) => x.data['updateLogisticStatus']));
    return result;
  }

  updatePageFlatStatus(status: boolean): Observable<IHTTPResult> {
    const result = this.apollo
      .mutate({
        mutation: gql`
          mutation updatePageFlatStatus($status: Boolean) {
            updatePageFlatStatus(status: $status) {
              status
            }
          }
        `,
        variables: {
          status: status,
        },
        refetchQueries: ['getPageFeeInfo'],
      })
      .pipe<IHTTPResult>(map((x) => x.data['updatePageFlatStatus']));
    return result;
  }

  updatePageDeliveryFee(fee: number): Observable<IHTTPResult> {
    const result = this.apollo
      .mutate({
        mutation: gql`
          mutation updatePageDeliveryFee($fee: Float) {
            updatePageDeliveryFee(fee: $fee) {
              status
            }
          }
        `,
        variables: {
          fee: fee,
        },
        refetchQueries: ['getPageFeeInfo'],
      })
      .pipe<IHTTPResult>(map((x) => x.data['updatePageDeliveryFee']));
    return result;
  }

  deleteLogistic(id: number): Observable<IHTTPResult> {
    const result = this.apollo
      .mutate({
        mutation: gql`
          mutation deleteLogistic($id: Int) {
            deleteLogistic(id: $id) {
              status
            }
          }
        `,
        variables: {
          id: id,
        },
        refetchQueries: ['getLogisticsByPageID'],
      })
      .pipe<IHTTPResult>(map((x) => x.data['deleteLogistic']));
    return result;
  }

  verifyJAndTExpress(): Observable<IHTTPResult> {
    return this.apollo
      .query({
        query: gql`
          query verifyJAndTExpress {
            verifyJAndTExpress {
              value
              status
            }
          }
        `,
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['verifyJAndTExpress']));
  }
}
