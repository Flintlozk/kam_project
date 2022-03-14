import { environmentLib } from '@reactor-room/environment-services-frontend';
import { IPayloadContainer } from '@reactor-room/itopplus-model-lib';
import axios from 'axios';
import { FBSendPayloadError } from '../../errors';

export async function sendPayload(version: string, pageToken: string, payload: IPayloadContainer): Promise<IPayloadContainer> {
  const url = `https://graph.facebook.com/${version}/me/messages?access_token=${pageToken}`;
  if (environmentLib.IS_STAGING) {
    console.log(JSON.stringify(payload.json));
  }
  try {
    const response = await axios.post(url, payload.json);
    return { ...payload, mid: response.data.message_id };
  } catch (err) {
    console.log(err.response?.headers['www-authenticate']);
    throw new FBSendPayloadError(err, payload.name);
  }
}
