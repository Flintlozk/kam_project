import { isAllowCaptureException } from '@reactor-room/itopplus-back-end-helpers';
import { EnumPaymentType, IPayment, IPaymentOmiseOption } from '@reactor-room/itopplus-model-lib';
import * as Sentry from '@sentry/node';
import { PlusmarService } from '../../itopplus-services-lib';
import { mapOmiseOption } from './omise-payment.domain';

export function EnumToBankName(type: string) {
  const bank = {
    KBANK: {
      name: 'Kasikorn Bank',
      icon: 'assets/img/bank/KBank.svg',
    },
    SCB: {
      name: 'The Siam Commercial Bank',
      icon: 'assets/img/bank/SCB.svg',
    },
    KTB: {
      name: 'Krung Thai Bank',
      icon: 'assets/img/bank/KTB.svg',
    },
    BBL: {
      name: 'Bangkok Bank',
      icon: 'assets/img/bank/BLL.svg',
    },
    TMB: {
      name: 'TMB Bank',
      icon: 'assets/img/bank/TMB.svg',
    },
    GSB: {
      name: 'Government Saving Bank',
      icon: 'assets/img/bank/GSB.svg',
    },
    BAY: {
      name: 'Bank of Ayudhya',
      icon: 'assets/img/bank/BAY.svg',
    },
  };
  return bank[type];
}
export function mapPaymentList(list: IPayment[]): IPayment[] {
  try {
    const mappedList = Object.keys(list).map((key) => {
      const lists = list[key];
      const item = lists[0];
      const obj = {
        id: item.id,
        name: item.name,
        status: item.status,
        type: item.type,
        option: null,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
      };
      switch (lists[0].type) {
        case EnumPaymentType.BANK_ACCOUNT: {
          obj.option = { BANK_ACCOUNT: [] };
          lists.map((bankItem) => {
            if (bankItem.bank_type !== null) {
              obj.option.BANK_ACCOUNT.push({
                id: bankItem.bank_id,
                accountId: bankItem.account_id,
                accountName: bankItem.account_name,
                branchName: bankItem.branch_name,
                bankStatus: bankItem.bank_status,
                bankType: bankItem.bank_type,
                bankCreatedAt: bankItem.bank_created_at,
                bankUpdatedAt: bankItem.bank_updated_at,
              });
            }
          });
          obj.option.BANK_ACCOUNT.sort((a, b) => (a.id > b.id ? 1 : -1));
          return obj;
        }
        case EnumPaymentType.CASH_ON_DELIVERY: {
          obj.option = { CASH_ON_DELIVERY: lists[0].option };
          return obj;
        }
        case EnumPaymentType.PAYPAL: {
          obj.option = { PAYPAL: lists[0].option };
          return obj;
        }
        case EnumPaymentType.PAYMENT_2C2P: {
          obj.option = { PAYMENT_2C2P: lists[0].option };
          return obj;
        }
        case EnumPaymentType.OMISE: {
          if (lists[0].option) {
            const omiseOption = mapOmiseOption(lists[0].option, lists[0].option.option);
            obj.option = {
              OMISE: omiseOption,
            };
          } else {
            obj.option = { OMISE: lists[0].option };
          }
          return obj;
        }
        default:
          return obj;
      }
    });
    return mappedList;
  } catch (err) {
    console.log('mapPaymentList err ===> : ', err);
    if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException({ err: 'mapPaymentList:', message: err.message });
    throw err;
  }
}
