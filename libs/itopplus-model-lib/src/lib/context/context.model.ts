import { EnumUserAppRole, IGoogleCredential } from '@reactor-room/model-lib';
import { EnumAuthScope } from '../auth/auth.model';
import { IPages } from '../pages/pages.model';
import { IPlanLimitAndDetails, ISubscription } from '../subscription/subscription.model';
export interface IGQLContext {
  app_module: EnumAuthScope;
  access_token: string;
  page_index: number;
  subscription_index: number;
  payload?: IPayload;
}

export interface IPayload {
  ID?: string;
  name?: string;
  email?: string;
  accessToken?: string;
  profileImg?: string;
  userID?: number;
  subscriptionID?: string;
  subscription?: ISubscription;
  pageID?: number;
  page?: IPages;
  activeStatus?: boolean;
  limitResources?: IPlanLimitAndDetails;
  allowScope?: EnumAuthScope[];
  allowAppRole?: EnumUserAppRole[];
  googleCredential?: IGoogleCredential;
}
