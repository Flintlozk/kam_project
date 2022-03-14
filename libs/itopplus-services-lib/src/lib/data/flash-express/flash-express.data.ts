import { IFlashExpressCommonParams, IFlashExpressCreateOrderResponse, IFlashExpressGenerateLabelResponse, IFlashExpressResponse } from '@reactor-room/itopplus-model-lib';
import Axios from 'axios';
import { PlusmarService } from '../../services/plusmarservice.class';
import fetch from 'node-fetch';

export const createOrderFlashExpress = async (params: string): Promise<IFlashExpressCreateOrderResponse> => {
  try {
    // DOC # http://open-docs.flashexpress.com/#create-order-orders
    const url = `${PlusmarService.environment.flashExpressApiURL}open/v1/orders`;
    const response = await Axios.post(url, params);
    const { data } = response;
    return data;
  } catch (err) {
    throw new Error(err);
  }
};

export const cancelOrderFlashExpress = async (trackingNumber: string, params: string): Promise<IFlashExpressResponse> => {
  try {
    // DOC # http://open-docs.flashexpress.com/#cancel-order-orders-pno-cancel
    const url = `${PlusmarService.environment.flashExpressApiURL}open/v1/orders/${trackingNumber}/cancel`;
    const response = await Axios.post(url, params);
    const { data } = response;
    return data;
  } catch (err) {
    console.log('cancelOrderFlashExpress err ::::::::::>>> ', err);
    throw new Error(err);
  }
};

export const getFlashExpressBigLabel = async (trackingNumber: string, params: string): Promise<Buffer> => {
  try {
    // DOC # http://open-docs.flashexpress.com/#print-big-label-orders-pno-pre_print
    const url = `${PlusmarService.environment.flashExpressApiURL}open/v1/orders/${trackingNumber}/pre_print`;
    const response = await fetch(url, {
      method: 'POST',
      body: params,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return await response.buffer();
  } catch (err) {
    throw new Error(err);
  }
};
export const getFlashExpressSmallLabel = async (trackingNumber: string, params: string): Promise<Buffer> => {
  try {
    // DOC # http://open-docs.flashexpress.com/#print-small-label-orders-pno-small-pre_print
    const url = `${PlusmarService.environment.flashExpressApiURL}open/v1/orders/${trackingNumber}/small/pre_print`;
    const response = await fetch(url, {
      method: 'POST',
      body: params,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return await response.buffer();
  } catch (err) {
    throw new Error(err);
  }
};

export const getFlashExpressParcelTracking = async (trackingNumber: string, params: string): Promise<IFlashExpressResponse> => {
  try {
    // DOC # http://open-docs.flashexpress.com/#tracking-order-orders-pno-routes
    const url = `${PlusmarService.environment.flashExpressApiURL}open/v1/orders/${trackingNumber}/routes`;
    const response = await Axios.post(url, params);
    const { data } = response;
    return data;
  } catch (err) {
    throw new Error(err);
  }
};
export const getFlashExpressParcelDeliveredInfo = async (trackingNumber: string, params: string): Promise<IFlashExpressResponse> => {
  try {
    // DOC # http://open-docs.flashexpress.com/#getparceldeliveredinfo-orders-pno-deliveredinfo
    const url = `${PlusmarService.environment.flashExpressApiURL}open/v1/orders/${trackingNumber}/deliveredInfo`;
    const response = await Axios.post(url, params);
    const { data } = response;
    return data;
  } catch (err) {
    throw new Error(err);
  }
};
