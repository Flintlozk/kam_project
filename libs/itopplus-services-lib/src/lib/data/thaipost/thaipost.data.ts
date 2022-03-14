import { IThaiPostCancelOrderParams, IThaiPostCreateOrderParams } from '@reactor-room/itopplus-model-lib';
import Axios, { AxiosBasicCredentials, AxiosResponse } from 'axios';

export const createThaiPostDropOffOrder = async (auth: AxiosBasicCredentials, params: IThaiPostCreateOrderParams): Promise<AxiosResponse> => {
  const url = 'https://r_dservice.thailandpost.com/webservice/addItem';
  return await Axios.post(url, params, {
    auth,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
export const cancelThaiPostDropOffOrder = async (auth: AxiosBasicCredentials, params: IThaiPostCancelOrderParams): Promise<AxiosResponse> => {
  const url = 'https://r_dservice.thailandpost.com/webservice/cancelOrder';
  return await Axios.post(url, params, {
    auth,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
