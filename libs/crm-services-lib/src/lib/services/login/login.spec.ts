import { mock } from '../../test/mock';
import * as data from '../../data/login/login.data';
import * as helperBackend from '@reactor-room/itopplus-back-end-helpers';
import { LoginService } from './login.service';
import { IGoogleCredential, IStateCreateCondition, IUserLevelPermission, LoginRespondingType } from '@reactor-room/crm-models-lib';

jest.mock('@reactor-room/itopplus-back-end-helpers');
describe('login', () => {
  const mockDataFromGoogle = {
    email: 'kanincharoen@theiconweb.com',
    pictureUrl: 'https://lh5.googleusercontent.com/-bw_wl3-kohc/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucm00GYs9utMxLAET8vlI0DdW-sMzA/s96-c/photo.jpg',
  };
  const mockDataFromDatabaseByGoogleEmail = {
    uuiduser: '35b33d3d-db29-4d90-b940-571276537939',
    username: 'Kanincha',
    email: 'kanincharoen@theiconweb.com',
    uuidOwner: '9987f11d-b350-4e45-973a-f5ba9713fe8a',
    departmentId: '1',
  };

  const mockTokenAfterSignJWT =
    // eslint-disable-next-line max-len
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkdXNlciI6IjM1YjMzZDNkLWRiMjktNGQ5MC1iOTQwLTU3MTI3NjUzNzkzOSIsInVzZXJuYW1lIjoiS2FuaW5jaGEiLCJlbWFpbCI6IjBjM2EyZjYzNTE4YzMwNDRkZTMzN2Q1Nzg4YTBiZWQ3OWViMGY2NjRmMDE3ZjRlZDg4MGFjNzVlNzliODU0YTkiLCJ1dWlkb3duZXIiOiI5OTg3ZjExZC1iMzUwLTRlNDUtOTczYS1mNWJhOTcxM2ZlOGEiLCJpYXQiOjE2MTcwMTE1NDZ9.JLIdx_ljAxNokP0kF7rvNXkiZL54vdKuplFeWQldB-M';
  const mockResultVerifyToken = {
    value: 'GRANT_ACCESS',
    token:
      // eslint-disable-next-line max-len
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkdXNlciI6IjM1YjMzZDNkLWRiMjktNGQ5MC1iOTQwLTU3MTI3NjUzNzkzOSIsInVzZXJuYW1lIjoiS2FuaW5jaGEiLCJlbWFpbCI6IjBjM2EyZjYzNTE4YzMwNDRkZTMzN2Q1Nzg4YTBiZWQ3OWViMGY2NjRmMDE3ZjRlZDg4MGFjNzVlNzliODU0YTkiLCJ1dWlkb3duZXIiOiI5OTg3ZjExZC1iMzUwLTRlNDUtOTczYS1mNWJhOTcxM2ZlOGEiLCJpYXQiOjE2MTcwMTE3NjV9.ckEZ_rFCtfY3NaifL_foHzabxYziAWaEKn5EYe4ysT0',
    status: 200,
    profilePictureUrl: 'https://lh5.googleusercontent.com/-bw_wl3-kohc/AAAAAAAAAAI/AAAAAAAAAAA/AMZuucm00GYs9utMxLAET8vlI0DdW-sMzA/s96-c/photo.jpg',
  };

  const mockSesstionValueRedis = {
    userLoginData: {
      uuiduser: '35b33d3d-db29-4d90-b940-571276537939',
      username: 'Kanincha',
      email: '0c3a2f63518c3044de337d5788a0bed79eb0f664f017f4ed880ac75e79b854a9',
      uuidOwner: '9987f11d-b350-4e45-973a-f5ba9713fe8a',
    },
  };
  const mockTokenFromGoogleLogin: IGoogleCredential = {
    id_token:
      // eslint-disable-next-line max-len
      'eyJhbGciOiJSUzI1NiIsImtpZCI6IjEzZThkNDVhNDNjYjIyNDIxNTRjN2Y0ZGFmYWMyOTMzZmVhMjAzNzQiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiYXpwIjoiOTcxNDQwNTQ4NDA4LTdodjlocDlncDRhbXNxcWNpMTdubDUzb251ZmtncmFkLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwiYXVkIjoiOTcxNDQwNTQ4NDA4LTdodjlocDlncDRhbXNxcWNpMTdubDUzb251ZmtncmFkLmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tIiwic3ViIjoiMTE0Nzk3NDkxNzM3NTUzMDI1MTE1IiwiaGQiOiJ0aGVpY29ud2ViLmNvbSIsImVtYWlsIjoia2FuaW5jaGFyb2VuQHRoZWljb253ZWIuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImF0X2hhc2giOiJUbnRyX3huMnVEa0VobHVjdkMyZkVnIiwibmFtZSI6IkthbmluIENoYXJvZW5yYXNzYW1lZWtpYXQiLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDUuZ29vZ2xldXNlcmNvbnRlbnQuY29tLy1id193bDMta29oYy9BQUFBQUFBQUFBSS9BQUFBQUFBQUFBQS9BTVp1dWNtMDBHWXM5dXRNeExBRVQ4dmxJMERkVy1zTXpBL3M5Ni1jL3Bob3RvLmpwZyIsImdpdmVuX25hbWUiOiJLYW5pbiIsImZhbWlseV9uYW1lIjoiQ2hhcm9lbnJhc3NhbWVla2lhdCIsImxvY2FsZSI6ImVuLUdCIiwiaWF0IjoxNjE3MDEyMDg2LCJleHAiOjE2MTcwMTU2ODYsImp0aSI6ImNjYWRkODMyYWZkZGIxY2I3MTBhMGU1NWEwZTFkNGY3ZjljOWQ4OTgifQ.ZN4rnoI7zP21hSJSKBU-qXafIy6z6ufR6eNr2pAlI65aXe6Tl-lnDnqw4iHKd--ZMbp541iFJg21Cnj1hB3DaFwHzoAIv3Pkpcg1M-F6hCT2xrWgyf_2Pz8eB-SfKEwA65zngJC1fFtHJoRxPGS4duUD_iLOyQIlp9SbyydfayN5rv6j6LFypbdSKqem0pM_Enla_yqJvUKUwUAvXDwxr--JCmikJpqRlHugeQ119OpkQvKYNEM8mwu5XzqoEzONQJPZlvTrPN2oqc6U2V7LhXpA93_mfp7iKIywxMj3c3ltJJfHum2qZumaW_Hfo_8RY1e_V2xxUlPQ3lhJM23onA',
    accessToken: '',
    expiresAt: '',
    ID: '',
    name: '',
    email: '',
    route: 'backend',
    profileImg: '',
  };

  const mockEmailGoogleInvalid = {
    uuiduser: '35b33d3d-db29-4d90-b940-571276537939',
    username: 'Kanincha',
    email: 'ABC@gmail.com',
    uuidOwner: '9987f11d-b350-4e45-973a-f5ba9713fe8a',
  };
  const mockResultGetScopePermission = [
    {
      allow_to_create_deal: true,
      allow_to_create_task: true,
      allow_to_imported: true,
    },
  ] as IUserLevelPermission[];
  const mockResultGetPermissionCreate = [{ stateId: 1, uuidState: 'b550230e-b1fe-4022-ad3f-9403d5cfc933', actionType: 'APPROVE' }] as IStateCreateCondition[];
  const pageKey = '55f9e154604e6dff';
  const tokenKey = "$E'TC}H2(o>X-.+,YG3NxZ^'Q)5f`h[}S6eER>kRk}F=IvQx`\"Gp^g$,tWv64#y";
  const mockUserWorkflow = [{ flowname: 'Sale' }, { flowname: 'AE' }];
  test('Login Google with user in database', async () => {
    mock(data, 'getGoogleUserByAccessToken', jest.fn().mockResolvedValue(mockDataFromGoogle));
    mock(data, 'getUserGoogleByEmail', jest.fn().mockResolvedValue(mockDataFromDatabaseByGoogleEmail));
    mock(data, 'getUserWorkflowByUserDepartment', jest.fn().mockResolvedValue(mockUserWorkflow));
    mock(LoginService, 'updateUserProfileFromGoogleService', jest.fn().mockResolvedValue({}));
    mock(data, 'signJWTPayload', jest.fn().mockResolvedValue(mockTokenAfterSignJWT));
    mock(data, 'verifyToken', jest.fn().mockResolvedValue(mockResultVerifyToken));
    mock(data, 'getUserScopePermission', jest.fn().mockResolvedValue(mockResultGetScopePermission));
    mock(data, 'getPermissionCreate', jest.fn().mockResolvedValue(mockResultGetPermissionCreate));
    mock(helperBackend, 'getKeysFromSession', jest.fn().mockResolvedValue(null));
    mock(helperBackend, 'setSessionValue', jest.fn().mockResolvedValue(mockSesstionValueRedis));
    const result = await LoginService.googleAuth(mockTokenFromGoogleLogin, pageKey, tokenKey);
    expect(data.getGoogleUserByAccessToken).toHaveBeenCalled();
    expect(data.getUserWorkflowByUserDepartment).toHaveBeenCalled();
    expect(data.getUserGoogleByEmail).toHaveBeenCalled();
    expect(data.signJWTPayload).toHaveBeenCalled();
    expect(data.getUserScopePermission).toHaveBeenCalled();
    expect(data.getPermissionCreate).toHaveBeenCalled();
    expect(LoginService.updateUserProfileFromGoogleService).toHaveBeenCalled();
    expect(helperBackend.setSessionValue).toHaveBeenCalled();

    expect(result.value).toBe(LoginRespondingType.GRANT_ACCESS);
    expect(result.status).toBe(200);
  });
  test('Login Google without user in database', async () => {
    mock(data, 'getGoogleUserByAccessToken', jest.fn().mockResolvedValue(mockDataFromGoogle));
    mock(data, 'getUserGoogleByEmail', jest.fn().mockResolvedValue(null));
    mock(data, 'getUserWorkflowByUserDepartment', jest.fn().mockResolvedValue(mockUserWorkflow));
    mock(LoginService, 'updateUserProfileFromGoogleService', jest.fn().mockResolvedValue({}));
    const result = await LoginService.googleAuth(mockTokenFromGoogleLogin, pageKey, tokenKey);
    expect(data.getGoogleUserByAccessToken).toHaveBeenCalled();
    expect(data.getUserGoogleByEmail).toHaveBeenCalled();
    expect(LoginService.updateUserProfileFromGoogleService).toHaveBeenCalled();
    expect(result.value).toBe(LoginRespondingType.YOUR_EMAIL_IS_NOT_ALLOWED);
    expect(result.status).toBe(403);
  });

  test('Login Google with user doesnt match in database', async () => {
    mock(data, 'getGoogleUserByAccessToken', jest.fn().mockResolvedValue(mockDataFromGoogle));
    mock(data, 'getUserGoogleByEmail', jest.fn().mockResolvedValue(mockEmailGoogleInvalid));
    mock(LoginService, 'updateUserProfileFromGoogleService', jest.fn().mockResolvedValue({}));
    const result = await LoginService.googleAuth(mockTokenFromGoogleLogin, pageKey, tokenKey);
    expect(data.getGoogleUserByAccessToken).toHaveBeenCalled();
    expect(data.getUserGoogleByEmail).toHaveBeenCalled();
    expect(LoginService.updateUserProfileFromGoogleService).toHaveBeenCalled();

    expect(result.value).toBe(LoginRespondingType.YOUR_EMAIL_IS_NOT_ALLOWED);
    expect(result.status).toBe(403);
  });

  test('Login Google with invalid token', async () => {
    mock(data, 'getGoogleUserByAccessToken', jest.fn().mockResolvedValue(mockDataFromGoogle));
    mock(data, 'getUserGoogleByEmail', jest.fn().mockResolvedValue(mockDataFromDatabaseByGoogleEmail));
    mock(LoginService, 'updateUserProfileFromGoogleService', jest.fn().mockResolvedValue({}));
    mock(data, 'signJWTPayload', jest.fn().mockResolvedValue('randomtoken-dsfsdfsdf-dfxcvxcvxcvx-aaaa'));
    mock(data, 'verifyToken', jest.fn().mockResolvedValue({ value: LoginRespondingType.ACCESS_DENY, status: 500 }));
    const result = await LoginService.googleAuth(mockTokenFromGoogleLogin, pageKey, tokenKey);
    expect(data.getGoogleUserByAccessToken).toHaveBeenCalled();
    expect(data.getUserGoogleByEmail).toHaveBeenCalled();
    expect(LoginService.updateUserProfileFromGoogleService).toHaveBeenCalled();

    expect(result.value).toBe(LoginRespondingType.GRANT_ACCESS);
    expect(result.status).toBe(200);
  });
});
