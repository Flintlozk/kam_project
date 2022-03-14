import { IPagesThirdParty, SocialTypes, TokenRefreshByTypes } from '@reactor-room/itopplus-model-lib';
import * as dayjs from 'dayjs';
import { getUTCDateFromString, getUTCDayjs } from './utc.helper';
/*
For Shopee :
Access token Expire in 4 Hours 
Refresh token Expire in 720 Hours

For Lazada :
Access token Expire in 168 Hours
Refresh token Expire in 720 Hours

tokenReAuthExpireConfig stores the config to refresh the access token using refresh token 

if refresh token expire hour from the db is more than the refreshTokenExpireInHours
if it is less than then it ask to user to re-auth and update the new access token

validateThirdPartyTokenExpire - 
params - page third party data with refresh token and access token expire date.
return - 
NO_REFRESH - no need to refresh access token
REFRESH_TOKEN - refresh access token using refresh token provided by market place
ACCESS_TOKEN - ask user to re-auth and issue a new access token 
*/

const tokenReAuthExpireConfig = {
  [SocialTypes.SHOPEE]: {
    accessTokenExpireInHours: 1,
    refreshTokenExpireInHours: 48,
  },
  [SocialTypes.LAZADA]: {
    accessTokenExpireInHours: 48,
    refreshTokenExpireInHours: 48,
  },
};

export const validateThirdPartyTokenExpireBackend = (thirdPartyPage: IPagesThirdParty): TokenRefreshByTypes => {
  if (thirdPartyPage.id) {
    const dateNow = dayjs(getUTCDayjs(), { utc: true }).format();
    const { accessTokenExpire, refreshTokenExpire, pageType } = thirdPartyPage;
    const accessTokenExpireFormat = getUTCDateFromString(accessTokenExpire);
    const refreshTokenExpireFormat = getUTCDateFromString(refreshTokenExpire);
    const accessTokenExpireHours = dayjs(accessTokenExpireFormat).diff(dateNow, 'hour');
    const refreshTokenExpireHours = dayjs(refreshTokenExpireFormat).diff(dateNow, 'hour');
    const refreshTokenStatus = refreshTokenExpireHours > tokenReAuthExpireConfig[pageType].refreshTokenExpireInHours;
    const isNoRefresh = refreshTokenStatus && accessTokenExpireHours > tokenReAuthExpireConfig[pageType].accessTokenExpireInHours;
    const isRefreshToken = refreshTokenExpireHours > tokenReAuthExpireConfig[pageType].refreshTokenExpireInHours;

    if (isNoRefresh) {
      return TokenRefreshByTypes.NO_REFRESH;
    } else if (isRefreshToken) {
      return TokenRefreshByTypes.REFRESH_TOKEN;
    } else {
      return TokenRefreshByTypes.ACCESS_TOKEN;
    }
  } else {
    return TokenRefreshByTypes.NO_REFRESH;
  }
};
