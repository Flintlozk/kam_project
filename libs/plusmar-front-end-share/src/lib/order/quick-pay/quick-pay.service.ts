import { Injectable } from '@angular/core';
import { IHTTPResult, ITableFilter } from '@reactor-room/model-lib';
import {
  IQuickPayCancelDetails,
  IQuickPayList,
  IQuickPayOrderItems,
  IQuickPayPaymentDetails,
  IQuickPayPaymentSave,
  IQuickPaySave,
  QuickPayComponentTypes,
} from '@reactor-room/itopplus-model-lib';
import { Apollo } from 'apollo-angular';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  GET_QUICK_PAY_CANCEL_DETAILS,
  GET_QUICK_PAY_LIST,
  GET_QUICK_PAY_ORDER_ITEMS,
  GET_QUICK_PAY_PAYMENT_DETAILS,
  QUICK_PAY_PAYMENT_CANCEL,
  SAVE_QUICK_PAY,
  SAVE_QUICK_PAY_PAYMENT,
  SEND_QUICK_PAY_TO_CHATBOX,
} from './quick-pay.query';

@Injectable({
  providedIn: 'root',
})
export class QuickPayService {
  showQuickPayComponents: QuickPayComponentTypes = QuickPayComponentTypes.TRANSACTION;
  private showQuickPayComponentBS = new BehaviorSubject<QuickPayComponentTypes>(this.showQuickPayComponents);
  showQuickPayComponent$ = this.showQuickPayComponentBS.asObservable();

  quickPayID$ = new Subject<number>();
  quickPayOrderDetail: IQuickPayList;

  quickPaySendResult$ = new Subject<IHTTPResult>();

  constructor(private apollo: Apollo) {}

  setShowQuickPayComponent(quickPayComponent: QuickPayComponentTypes): void {
    this.showQuickPayComponentBS.next(quickPayComponent);
  }

  saveQuickPay(audienceID: number, vat: number, quickPayBillInput: IQuickPaySave): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: SAVE_QUICK_PAY,
        variables: {
          audienceID,
          vat,
          quickPayBillInput,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['saveQuickPay']));
  }

  quickPayPaymentCancel(id: number, description: string): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: QUICK_PAY_PAYMENT_CANCEL,
        variables: {
          id,
          description,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['quickPayPaymentCancel']));
  }

  getQuickPayList(audienceID: number, customerID: number, filters: ITableFilter): Observable<IQuickPayList[]> {
    return this.apollo
      .query({
        query: GET_QUICK_PAY_LIST,
        variables: {
          audienceID,
          customerID,
          filters,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['getQuickPayList']));
  }

  getQuickPayOrderItemsByOrderID(id: number): Observable<IQuickPayOrderItems[]> {
    return this.apollo
      .query({
        query: GET_QUICK_PAY_ORDER_ITEMS,
        variables: {
          id,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['getQuickPayOrderItemsByOrderID']));
  }

  saveQuickPayPayment(id: number, quickPayPaymentInput: IQuickPayPaymentSave): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: SAVE_QUICK_PAY_PAYMENT,
        variables: {
          id,
          quickPayPaymentInput,
        },
        fetchPolicy: 'no-cache',
        context: {
          useMultipart: true,
        },
      })
      .pipe(map((response) => response.data['saveQuickPayPayment']));
  }

  sendQuickPayToChatBox(quickPayID: number, audienceID: number, PSID: string): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: SEND_QUICK_PAY_TO_CHATBOX,
        variables: {
          quickPayID,
          audienceID,
          PSID,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['sendQuickPayToChatBox']));
  }

  getQuickPayCancelDetails(id: number): Observable<IQuickPayCancelDetails> {
    return this.apollo
      .query({
        query: GET_QUICK_PAY_CANCEL_DETAILS,
        variables: {
          id,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['getQuickPayCancelDetails']));
  }

  getQuickPayPaymentDetails(id: number): Observable<IQuickPayPaymentDetails> {
    return this.apollo
      .query({
        query: GET_QUICK_PAY_PAYMENT_DETAILS,
        variables: {
          id,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['getQuickPayPaymentDetails']));
  }
}
