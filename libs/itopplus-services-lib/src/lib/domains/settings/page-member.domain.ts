import { IPageMemberToken, EnumValidateToken, IPageMemberModel } from '@reactor-room/itopplus-model-lib';

export const validatePageMemberToken = (token: string, tokenPayload, userMapToken: IPageMemberToken): EnumValidateToken => {
  if (!userMapToken) return EnumValidateToken.NO_TOKEN;
  if (userMapToken.token !== token) return EnumValidateToken.TOKEN_NOT_MATCH;
  if (userMapToken.email !== tokenPayload.email) return EnumValidateToken.USER_EMAIL_NOT_MATCH;
  if (userMapToken.page_id !== tokenPayload.page_id) return EnumValidateToken.PAGE_ID_NOT_MATCH;
  if (userMapToken.user_id && userMapToken.user_id !== tokenPayload.user_id) return EnumValidateToken.USER_ID_NOT_MATCH;
  else return EnumValidateToken.VALID;
};

export const mapWithEmptyName = (nonUsers: IPageMemberModel[]): IPageMemberModel[] => {
  return nonUsers.map((user) => {
    return {
      ...user,
      name: '',
    };
  });
};
