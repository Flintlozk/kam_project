import type { IOmiseChargeDetail, IOmiseSourceDetail, IOmiseCapability, IOmiseDetail, IOmisePaymentMetaData } from '@reactor-room/itopplus-model-lib';
import { EnumOmiseSourceType } from '@reactor-room/itopplus-model-lib';
import Axios from 'axios';

export const checkOmiseAccount = async (omiseDetail: IOmiseDetail): Promise<void> => {
  try {
    await Axios.get('https://api.omise.co/account', {
      auth: {
        username: omiseDetail.secretKey,
        password: '',
      },
    });
  } catch (err) {
    console.log('checkOmiseAccount ===> err : ', err);
    throw err;
  }
};

export const getOmiseAccountCapability = async (key: string): Promise<IOmiseCapability> => {
  try {
    const url = 'https://api.omise.co/capability';
    const { data } = await Axios.get(url, {
      auth: {
        username: key,
        password: '',
      },
    });
    const omiseResponse = data as IOmiseCapability;
    return omiseResponse;
  } catch (err) {
    console.log('err: getOmiseAccountCapability => ', err);
    throw err;
  }
};

export const getOmiseSourceDetails = async (source: string, key: string): Promise<IOmiseSourceDetail> => {
  try {
    const url = `https://api.omise.co/sources/${source}`;
    const { data } = await Axios.get(url, {
      auth: {
        username: key,
        password: '',
      },
    });
    const opmiseResponse = data as IOmiseSourceDetail;
    return opmiseResponse;
  } catch (err) {
    console.log('err: checkOmisePaymentSuccess => ', err);
    throw err;
  }
};

export const creatOmisePromptpayCharge = async (createOmiseInput: IOmisePaymentMetaData, key: string): Promise<IOmiseChargeDetail> => {
  try {
    const source = {};
    if (createOmiseInput.source === EnumOmiseSourceType.PROMPTPAY) source['type'] = 'promptpay';
    const metadata = {};
    metadata['poID'] = createOmiseInput.poID;
    metadata['responseType'] = createOmiseInput.responseType;
    metadata['amount'] = createOmiseInput.amount;
    metadata['audienceID'] = createOmiseInput.audienceID;
    metadata['psid'] = createOmiseInput.psid;
    const { data } = await Axios.post(
      'https://api.omise.co/charges',
      {
        amount: createOmiseInput.amount,
        currency: createOmiseInput.currency,
        source,
        metadata,
      },
      {
        auth: {
          username: key,
          password: '',
        },
      },
    );
    return data as IOmiseChargeDetail;
  } catch (err) {
    console.log('creatOmisePromptpayCharge ===> err: ', err);
    throw err;
  }
};

export const creatOmiseCreditCardCharge = async (createOmiseInput: IOmisePaymentMetaData, token: string, key: string): Promise<IOmiseChargeDetail> => {
  try {
    const metadata = {};
    metadata['poID'] = createOmiseInput.poID;
    metadata['responseType'] = createOmiseInput.responseType;
    metadata['amount'] = createOmiseInput.amount;
    metadata['audienceID'] = createOmiseInput.audienceID;
    metadata['psid'] = createOmiseInput.psid;
    const { data } = await Axios.post(
      'https://api.omise.co/charges',
      {
        amount: createOmiseInput.amount,
        currency: createOmiseInput.currency,
        card: token,
        metadata,
      },
      {
        auth: {
          username: key,
          password: '',
        },
      },
    );
    return data as IOmiseChargeDetail;
  } catch (err) {
    console.log('creatOmiseCreditCardCharge ===>  err: ', err);
    throw err;
  }
};

export const creatOmiseInternetBankingCharge = async (createOmiseInput: IOmisePaymentMetaData, source: string, returnUrl: string, key: string): Promise<IOmiseChargeDetail> => {
  try {
    const metadata = {};
    metadata['poID'] = createOmiseInput.poID;
    metadata['responseType'] = createOmiseInput.responseType;
    metadata['amount'] = createOmiseInput.amount;
    metadata['audienceID'] = createOmiseInput.audienceID;
    metadata['psid'] = createOmiseInput.psid;
    const { data } = await Axios.post(
      'https://api.omise.co/charges',
      {
        amount: createOmiseInput.amount,
        currency: createOmiseInput.currency,
        source: source,
        return_uri: returnUrl,
        metadata,
      },
      {
        auth: {
          username: key,
          password: '',
        },
      },
    );
    return data as IOmiseChargeDetail;
  } catch (err) {
    console.log('creatOmiseInternetBankingCharge ===> err : ', err);
    throw err;
  }
};

export const checkOmisePaymentSuccess = async (chargeID: string, key: string): Promise<IOmiseChargeDetail> => {
  try {
    const url = `https://api.omise.co/charges/${chargeID}`;
    const { data } = await Axios.get(url, {
      auth: {
        username: key,
        password: '',
      },
    });
    const opmiseResponse = data as IOmiseChargeDetail;
    return opmiseResponse;
  } catch (err) {
    console.log('err: checkOmisePaymentSuccess => ', err);
    throw err;
  }
};

export const checkValidOmiseCharge = async (omiseCharge: IOmiseChargeDetail, key: string): Promise<IOmiseChargeDetail> => {
  try {
    const url = `https://api.omise.co/charges/${omiseCharge.id}`;
    const { data } = await Axios.get(url, {
      auth: {
        username: key,
        password: '',
      },
    });
    const omiseResponse = data as IOmiseChargeDetail;
    return omiseResponse;
  } catch (err) {
    console.log('checkValidOmiseCharge ===> err : ', err);
    throw err;
  }
};
