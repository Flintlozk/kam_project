import { ICrmFlowName, IGoogleCredential, IStateCreateCondition } from '../common';

export interface IGQLContext {
  access_token: string;
  page_index?: number;
  subscription_index?: number;
  payload?: IPayload;
}
export interface IPayload {
  credential: IGoogleCredential;
  userLoginData: IUserLoginDetail;
  userPermission: IUserLevelPermission[];
  taskCreateCondition: IStateCreateCondition[];
  userWorkflow: ICrmFlowName[];
}
export interface IUserLoginDetail {
  id?: string;
  username?: string;
  email?: string;
  accessToken?: string;
  uuidOwner?: string;
  ownerId?: number;
  userId?: number;
  is_admin: boolean;
  profilePic: string;
}
export interface IUserLevelPermission {
  allow_to_imported: boolean;
  allow_to_create_deal: boolean;
  allow_to_create_task: boolean;
}
