import axios from 'axios';
import { IFacebookLongLiveTokenResponse } from '@reactor-room/model-lib';

export function getFacebookLongLiveAccessToken(facebookAppID: string, facebookAppSecret: string, accessToken: string): Promise<IFacebookLongLiveTokenResponse> {
  return new Promise((resolve, reject) => {
    axios
      .get(
        // eslint-disable-next-line max-len
        `https://graph.facebook.com/v9.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${facebookAppID}&client_secret=${facebookAppSecret}&fb_exchange_token=${accessToken}`,
      )
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
