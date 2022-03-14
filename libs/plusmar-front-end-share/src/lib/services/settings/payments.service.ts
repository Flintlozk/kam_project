import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import {
  BankAccount,
  CashOnDeliveryDetail,
  EnumPaymentType,
  I2C2PPaymentModel,
  IOmiseDetail,
  IPayment,
  IPaymentOmiseOption,
  PaypalDetail,
  ReturnAddBankAccount,
  SettingPaymentResponse,
} from '@reactor-room/itopplus-model-lib';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PaymentsService {
  constructor(private ngZone: NgZone, private router: Router, private apollo: Apollo) {}

  getPaymentList(): Observable<[IPayment]> {
    return this.apollo
      .watchQuery({
        query: gql`
          query getPaymentList {
            getPaymentList {
              id
              status
              type
              createdAt
              updatedAt
              option {
                BANK_ACCOUNT {
                  id
                  branchName
                  accountName
                  bankStatus
                  accountId
                  bankType
                  bankCreatedAt
                  bankUpdatedAt
                }
                CASH_ON_DELIVERY {
                  feePercent
                  feeValue
                  minimumValue
                }
                PAYPAL {
                  clientId
                  clientSecret
                  feePercent
                  feeValue
                  minimumValue
                }
                PAYMENT_2C2P {
                  merchantID
                  secretKey
                }
                OMISE {
                  publicKey
                  secretKey
                  option {
                    creditCard
                    qrCode
                  }
                }
              }
            }
          }
        `,
        fetchPolicy: 'no-cache',
      })
      .valueChanges.pipe<[IPayment]>(map((x) => x.data['getPaymentList']));
  }

  getPaymentListByLogistic(audienceID: number, logisticID: number): Observable<[IPayment]> {
    return this.apollo
      .watchQuery({
        query: gql`
          query getPaymentListByLogistic($audienceID: Int, $logisticID: Int) {
            getPaymentListByLogistic(audienceID: $audienceID, logisticID: $logisticID) {
              id
              status
              type
              createdAt
              updatedAt
              option {
                BANK_ACCOUNT {
                  id
                  branchName
                  accountName
                  bankStatus
                  accountId
                  bankType
                  bankCreatedAt
                  bankUpdatedAt
                }
                CASH_ON_DELIVERY {
                  feePercent
                  feeValue
                  minimumValue
                }
                PAYPAL {
                  clientId
                  clientSecret
                  feePercent
                  feeValue
                  minimumValue
                }
                PAYMENT_2C2P {
                  merchantID
                  secretKey
                }
                OMISE {
                  publicKey
                  secretKey
                }
              }
            }
          }
        `,
        variables: { logisticID, audienceID },
        fetchPolicy: 'no-cache',
      })
      .valueChanges.pipe<[IPayment]>(map((x) => x.data['getPaymentListByLogistic']));
  }

  getPaymentListInfo(): Observable<[IPayment]> {
    return this.apollo
      .watchQuery({
        query: gql`
          query getPaymentList {
            getPaymentList {
              id
              status
              type
              createdAt
              updatedAt
              option {
                BANK_ACCOUNT {
                  id
                  branchName
                  accountName
                  bankStatus
                  accountId
                  bankType
                  bankCreatedAt
                  bankUpdatedAt
                }
                CASH_ON_DELIVERY {
                  feePercent
                  feeValue
                  minimumValue
                }
                PAYPAL {
                  feePercent
                  feeValue
                  minimumValue
                }
                PAYMENT_2C2P {
                  merchantID
                  secretKey
                }
                OMISE {
                  publicKey
                  secretKey
                }
              }
            }
          }
        `,
      })
      .valueChanges.pipe<[IPayment]>(map((x) => x.data['getPaymentList']));
  }

  getBankAccountList(): Observable<ReturnAddBankAccount[]> {
    return this.apollo
      .watchQuery({
        query: gql`
          query getBankAccountList {
            getBankAccountList {
              id
              branch_name
              account_name
              status
              account_id
              type
            }
          }
        `,
      })
      .valueChanges.pipe<ReturnAddBankAccount[]>(map((x) => x.data['getBankAccountList']));
  }

  togglePaymentByType(type: EnumPaymentType): Observable<SettingPaymentResponse> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation togglePaymentByType($type: EnumPaymentType) {
            togglePaymentByType(type: $type) {
              status
              message
            }
          }
        `,
        variables: {
          type,
        },
        refetchQueries: ['getPaymentList'],
      })
      .pipe<SettingPaymentResponse>(map((x) => x.data['togglePaymentByType']));
  }

  // *************************** Payment / COD ****************************************

  updateCOD(codDetail: CashOnDeliveryDetail): Observable<SettingPaymentResponse> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation updateCOD($codDetail: CODInput) {
            updateCOD(codDetail: $codDetail) {
              status
              message
            }
          }
        `,
        variables: {
          codDetail,
        },
      })
      .pipe<SettingPaymentResponse>(map((x) => x.data['updateCOD']));
  }
  // *************************** Payment / Paypal ****************************************

  updatePaypal(paypalDetail: PaypalDetail): Observable<SettingPaymentResponse> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation updatePaypal($paypalDetail: PaypalInput) {
            updatePaypal(paypalDetail: $paypalDetail) {
              status
              message
            }
          }
        `,
        variables: {
          paypalDetail,
        },
        refetchQueries: ['getPaymentList'],
      })
      .pipe<SettingPaymentResponse>(map((x) => x.data['updatePaypal']));
  }

  // *************************** Payment / 2C2P ****************************************

  update2C2P(payment2c2pDetail: I2C2PPaymentModel): Observable<SettingPaymentResponse> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation update2C2P($payment2c2pDetail: Payment2C2PInput) {
            update2C2P(payment2c2pDetail: $payment2c2pDetail) {
              status
              message
            }
          }
        `,
        variables: {
          payment2c2pDetail,
        },
        refetchQueries: ['getPaymentList'],
      })
      .pipe<SettingPaymentResponse>(map((x) => x.data['update2C2P']));
  }

  // *************************** Payment / OMISE ****************************************

  validateOmiseAccountAndGetCapability(omiseDetail: IOmiseDetail): Observable<IPaymentOmiseOption> {
    return this.apollo
      .query({
        query: gql`
          query validateOmiseAccountAndGetCapability($omiseDetail: OmiseInput) {
            validateOmiseAccountAndGetCapability(omiseDetail: $omiseDetail) {
              creditCard
              qrCode
            }
          }
        `,
        fetchPolicy: 'network-only',
        variables: {
          omiseDetail,
        },
      })
      .pipe<IPaymentOmiseOption>(map((x) => x.data['validateOmiseAccountAndGetCapability']));
  }

  getOmisePaymentCapability(): Observable<IPaymentOmiseOption> {
    return this.apollo
      .query({
        query: gql`
          query getOmisePaymentCapability {
            getOmisePaymentCapability {
              creditCard
              qrCode
            }
          }
        `,
        fetchPolicy: 'network-only',
      })
      .pipe<IPaymentOmiseOption>(map((x) => x.data['getOmisePaymentCapability']));
  }

  updateOmise(omiseDetail: IOmiseDetail): Observable<SettingPaymentResponse> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation updateOmise($omiseDetail: OmiseInput) {
            updateOmise(omiseDetail: $omiseDetail) {
              status
              message
            }
          }
        `,
        variables: {
          omiseDetail,
        },
        refetchQueries: ['getPaymentList'],
      })
      .pipe<SettingPaymentResponse>(map((x) => x.data['updateOmise']));
  }

  // *************************** Payment / Bank Account ****************************************
  toggleBankAccountStatus(bankAccountId: number): Observable<SettingPaymentResponse> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation toggleBankAccountStatus($bankAccountId: Int) {
            toggleBankAccountStatus(bankAccountId: $bankAccountId) {
              status
              message
            }
          }
        `,
        variables: {
          bankAccountId,
        },
        refetchQueries: ['getBankAccountList'],
      })
      .pipe<SettingPaymentResponse>(map((x) => x.data['toggleBankAccountStatus']));
  }

  addBankAccount(bankAccount: BankAccount): Observable<ReturnAddBankAccount> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation addBankAccount($bankAccount: BankAccountInput) {
            addBankAccount(bankAccount: $bankAccount) {
              id
              branch_name
              account_name
              account_id
              status
              type
            }
          }
        `,
        variables: {
          bankAccount,
        },
        refetchQueries: ['getBankAccountList'],
      })
      .pipe<ReturnAddBankAccount>(map((x) => x.data['addBankAccount']));
  }

  updateBankAccount(bankAccountId: number, bankAccount: BankAccount): Observable<ReturnAddBankAccount> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation updateBankAccount($bankAccountId: Int, $bankAccount: BankAccountInput) {
            updateBankAccount(bankAccountId: $bankAccountId, bankAccount: $bankAccount) {
              id
              branch_name
              account_name
              account_id
              status
              type
            }
          }
        `,
        variables: {
          bankAccountId,
          bankAccount,
        },
        refetchQueries: ['getBankAccountList'],
      })
      .pipe<ReturnAddBankAccount>(map((x) => x.data['updateBankAccount']));
  }

  removeBankAccount(bankAccountId: number): Observable<SettingPaymentResponse> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation removeBankAccount($bankAccountId: Int) {
            removeBankAccount(bankAccountId: $bankAccountId) {
              status
              message
            }
          }
        `,
        variables: {
          bankAccountId,
        },
        refetchQueries: ['getBankAccountList'],
      })
      .pipe<SettingPaymentResponse>(map((x) => x.data['removeBankAccount']));
  }
}
