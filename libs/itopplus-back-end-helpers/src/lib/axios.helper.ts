import { IHTTPResult } from '@reactor-room/model-lib';
import axios, { AxiosResponse, AxiosError } from 'axios';

export const axiosGet = async (url: string): Promise<boolean> => {
  try {
    await axios.get(url);
    return true;
  } catch (err) {
    return false;
  }
};

export const axiosGetJsonResponse = async <T>(url: string, headers = {}): Promise<T> => {
  try {
    const result = await axios.get<T>(url, { headers: headers });
    if (result.status == 200) {
      return result.data;
    } else {
      throw new Error('Error at axiosGetJsonResponse ' + url);
    }
  } catch (err) {
    throw new Error('Error at axiosGetJsonResponse ' + url);
  }
};
export const axiosGetJsonResponseWithHandleError = async <T>(url: string, headers = {}): Promise<T> => {
  try {
    const result = await axios.get<T>(url, { headers: headers });
    if (result.status == 200) {
      return result.data;
    } else {
      throw new Error('Error at axiosGetJsonResponse ' + url);
    }
  } catch (err) {
    if (err?.response?.status === 404) {
      return null;
    } else {
      throw new Error('Error at axiosGetJsonResponse ' + url + '\n' + JSON.stringify(err?.response?.data, null, 2));
    }
  }
};

export const axiosGetWithParams = async <T>(url: string, params: T): Promise<AxiosResponse<any>> => {
  try {
    return await axios.get(url, { params });
  } catch (error) {
    const errMsg = `${error?.response?.data?.message || ''} -> ${url} -> ${error?.message}`;
    console.log('error at axiosGetWithParams :>> ', errMsg);
    throw new Error('Error ' + errMsg);
  }
};

export const axiosPost = async (
  url: string,
  payload: any,
  headers = {
    'Content-Type': 'application/json',
  },
): Promise<IHTTPResult> => {
  try {
    const result: AxiosResponse = await axios.post(url, payload, { headers: headers });
    return { status: result.status, value: result.data } as IHTTPResult;
  } catch (err) {
    return { status: err?.response?.status, value: err?.response?.data?.message } as IHTTPResult;
  }
};

export const axiosPostWithoutHeader = async <T>(url: string, payload?: T): Promise<AxiosResponse<any>> => {
  try {
    if (payload) {
      const result: AxiosResponse = await axios.post(url, payload);
      return result;
    } else {
      const result: AxiosResponse = await axios.post(url);
      return result;
    }
  } catch (error) {
    console.log('error at axiosPostWithoutHeader :>> ', error.message);
    throw new Error('Error at axiosPostWithoutHeader ' + url);
  }
};

export const axiosPostWithHeader = async <T, X>(url: string, params: T, headers: X): Promise<AxiosResponse<any>> => {
  try {
    const result: AxiosResponse = await axios.post(url, params, { headers });
    return result;
  } catch (error) {
    console.log('error at axiosPostWithHeader :>> ', error.message, error?.response?.data?.message);
    throw new Error('Error at axiosPostWithHeader ' + url + ' ' + error?.response?.data?.message);
  }
};

export const axiosPostWithFormData = async (url: string, data: any, headers): Promise<AxiosResponse<any>> => {
  try {
    const result: AxiosResponse = await axios({
      method: 'post',
      url,
      data,
      headers: headers,
    });
    return result;
  } catch (error) {
    console.log('error at axiosPostWithFormData :>> ', error.data);
    throw new Error('Error at axiosPostWithFormData ' + url + error.data);
  }
};

export const axiosGetWithHeaderResponseBinary = async <T, X>(url: string, headers: X): Promise<AxiosResponse<any>> => {
  try {
    const result: AxiosResponse = await axios.request({
      responseType: 'arraybuffer',
      url: url,
      method: 'get',
      headers: headers,
    });
    return result;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return error.response;
    } else {
      throw new Error('Error at axiosPostWithoutHeader ' + url);
    }
  }
};
