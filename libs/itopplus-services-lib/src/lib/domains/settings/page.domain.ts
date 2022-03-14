import { EnumAppScopeType, IPageAppScope, IPages, ISettingPageMember } from '@reactor-room/itopplus-model-lib';

export const createObjPage = (pageDetail): [ISettingPageMember] => {
  const createObj = [
    {
      memberlimit: pageDetail[0].maximum_members,
      memberusing: pageDetail.length,
    },
  ] as [ISettingPageMember];
  return createObj;
};

export const mapAppScopes = (pageAppScopes: IPageAppScope[]): EnumAppScopeType[] => {
  return pageAppScopes.map((x) => x.app_scope);
};
