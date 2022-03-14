import { IJAndTJsonAddress, IJAndTExpressResponseData } from '@reactor-room/itopplus-model-lib';
import { JTExpressAddressesSchemaModel as JTExpressAddresses } from '@reactor-room/plusmar-model-mongo-lib';

import Axios from 'axios';
import { PlusmarService } from '../../services/plusmarservice.class';

export const createOrderJAndTExpress = async (params: string): Promise<IJAndTExpressResponseData> => {
  try {
    // DOC # http://47.57.97.45/thailand-ifd-web/index.do
    const url = `${PlusmarService.environment.jAndTExpressApiURL}order/createOrder.do`;
    const response = await Axios.post(url, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const { data } = response;
    return data;
  } catch (err) {
    console.log('createOrderJAndTExpress ===> err: ', err);
    throw new Error(err);
  }
};

export const cancelOrderJAndTExpress = async (params: string): Promise<IJAndTExpressResponseData> => {
  try {
    // DOC # http://47.57.97.45/thailand-ifd-web/index.do
    const url = `${PlusmarService.environment.jAndTExpressApiURL}order/cancelOrder.do`;
    const response = await Axios.post(url, params);
    const { data } = response;
    return data;
  } catch (err) {
    console.log('cancelOrderJAndT err ::::::::::>>> ', err);
    throw new Error(err);
  }
};

export const getJAndTExpressLabel = async (params: string): Promise<IJAndTExpressResponseData> => {
  try {
    // DOC # http://47.57.97.45/thailand-ifd-web/index.do
    const url = `${PlusmarService.environment.jAndTExpressApiURL}order/getReportUrl.do`;
    const response = await Axios.post(url, params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    const { data } = response;
    return data;
  } catch (err) {
    console.log('getJAndTExpressLabel err ::::::::::>>> ', err);
    throw new Error(err);
  }
};

export const getJAndTExpressOrderTracking = async (params: string): Promise<IJAndTExpressResponseData> => {
  try {
    // DOC # http://47.57.97.45/thailand-ifd-web/index.do
    const url = `${PlusmarService.environment.jAndTExpressApiURL}track/tracking.do`;
    const response = await Axios.post(url, params);
    const { data } = response;
    return data;
  } catch (err) {
    console.log('getJAndTExpressOrderTracking err ::::::::::>>> ', err);
    throw new Error(err);
  }
};

export const getJTExpressAddresses = async (): Promise<IJAndTJsonAddress[]> => {
  return await JTExpressAddresses.find();
};
