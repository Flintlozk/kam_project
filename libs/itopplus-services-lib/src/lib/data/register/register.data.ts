import { IHTTPResult } from '@reactor-room/model-lib';
import axios from 'axios';

export async function requestOTP(key: string, secret: string, phoneNumber: string): Promise<IHTTPResult> {
  try {
    const url = 'https://otp.thaibulksms.com/v1/otp/request';
    const payload = {
      key: key,
      secret: secret,
      msisdn: phoneNumber,
    };
    const headers = {
      'content-type': 'application/json',
    };

    const { data } = await axios.post(url, payload, {
      headers: headers,
    });
    return { status: data.data.status, value: data.data.token };
  } catch (err) {
    console.log('ERR:', err);
    return null;
  }
}

export async function verifyOTP(key: string, secret: string, token: string, pin: string): Promise<IHTTPResult> {
  try {
    const url = 'https://otp.thaibulksms.com/v1/otp/verify';

    const payload = {
      key: key,
      secret: secret,
      pin: pin,
      token: token,
    };
    const headers = {
      'content-type': 'application/json',
    };
    const { data } = await axios.post(url, payload, {
      headers: headers,
    });
    return { status: data.data.status, value: data.data.message };
  } catch (err) {
    console.log('Err: ', err);
    return null;
  }
}
