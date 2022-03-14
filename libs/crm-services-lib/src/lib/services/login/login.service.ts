import {
  getGoogleUserByAccessToken,
  getPermissionCreate,
  getUserGoogleByEmail,
  getUserScopePermission,
  getUserWorkflowByUserDepartment,
  signJWTPayload,
  updateUserProfileFromGoogle,
  verifyToken,
} from '../../data/login/login.data';
import { CrmService } from '../crmservice.class';
import { cryptoEncode, setSessionValue } from '@reactor-room/itopplus-back-end-helpers';
import { ILoginResponse, LoginRespondingType } from '@reactor-room/crm-models-lib';
import { IGoogleCredential, IHTTPResult } from '@reactor-room/model-lib';

export class LoginService {
  constructor() {}

  public static googleAuth = async (credential: IGoogleCredential, pageKey: string, tokenKey: string): Promise<ILoginResponse> => {
    const dataFromGoogle = await getGoogleUserByAccessToken(credential.id_token);
    const userLoginData = await getUserGoogleByEmail(CrmService.readerClient, dataFromGoogle.email);
    await LoginService.updateUserProfileFromGoogleService(dataFromGoogle.email, dataFromGoogle.pictureUrl);
    if (userLoginData === null || userLoginData.email !== dataFromGoogle.email) {
      return { status: 403, value: LoginRespondingType.YOUR_EMAIL_IS_NOT_ALLOWED, profilePictureUrl: '', name: '', defaultWorkflow: '', ownerPicLink: '' };
    }
    const userWorkflow = await getUserWorkflowByUserDepartment(CrmService.readerClient, userLoginData.departmentId);
    const date = new Date();
    const dateString = date.toString();
    const redisKey = userLoginData.uuiduser + dateString;
    const redisKeyEncode = cryptoEncode(redisKey, pageKey);
    const tokenJWT = await signJWTPayload(redisKeyEncode, tokenKey);
    const { ownerId, userId } = userLoginData;
    const userPermission = await getUserScopePermission(CrmService.readerClient, userId, ownerId);
    const taskCreateCondition = await getPermissionCreate(CrmService.readerClient, userId, ownerId);
    const payload = {
      credential,
      userLoginData,
      userPermission,
      taskCreateCondition,
      userWorkflow,
    };
    await setSessionValue(CrmService.redisClient, redisKey, payload);
    return {
      status: 200,
      value: LoginRespondingType.GRANT_ACCESS,
      token: tokenJWT,
      profilePictureUrl: dataFromGoogle.pictureUrl,
      name: userLoginData.username,
      defaultWorkflow: userLoginData.flowId,
      ownerPicLink: userLoginData.ownerPicLink,
    };
  };
  public static verifyAuth = async (token: string, tokenKey: string): Promise<ILoginResponse> => {
    const result = await verifyToken(token, tokenKey);
    if (result.value) {
      result.value = LoginRespondingType.GRANT_ACCESS;
    }
    return result;
  };
  public static updateUserProfileFromGoogleService = async (email: string, profilePic: string): Promise<IHTTPResult> => {
    const result = await updateUserProfileFromGoogle(CrmService.writerClient, email, profilePic);
    return result;
  };
}
