import { EnumBankAccountType, IBankAccountDetails, IBankAccountDetailsItem } from '@reactor-room/itopplus-model-lib';

export const getBankAccountDetailArray = (): IBankAccountDetailsItem[] => [
  { imgUrl: 'assets/img/bank/KBank.svg', title: 'Kasikorn Bank Pubilc Co., Ltd.', type: EnumBankAccountType.KBANK },
  { imgUrl: 'assets/img/bank/SCB.svg', title: 'The Siam Commercial Bank Public Co., Ltd', type: EnumBankAccountType.SCB },
  { imgUrl: 'assets/img/bank/KTB.svg', title: 'Krung Thai Bank Public Co., Ltd', type: EnumBankAccountType.KTB },
  { imgUrl: 'assets/img/bank/BBL.svg', title: 'Bangkok Bank Public Co., Ltd', type: EnumBankAccountType.BBL },
  { imgUrl: 'assets/img/bank/TMB.svg', title: 'TMB Bank Public Co., Ltd', type: EnumBankAccountType.TMB },
  { imgUrl: 'assets/img/bank/GSB.svg', title: 'Government Saving Bank', type: EnumBankAccountType.GSB },
  { imgUrl: 'assets/img/bank/BAY.svg', title: 'Bank of Ayudhya Public Co., Ltd', type: EnumBankAccountType.BAY },
];

export const getBankAccountDetailObject = (): IBankAccountDetails => {
  const bankDetails = getBankAccountDetailArray();
  const bankObj = {} as IBankAccountDetails;
  bankDetails.forEach((bank) => {
    bankObj[bank.type] = bank;
  });
  return bankObj;
};
