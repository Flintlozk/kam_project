import { EnumAppScopeType, EnumAuthError, EnumAuthScope, EnumPagesError } from '@reactor-room/itopplus-model-lib';
import { IHTTPResult } from '@reactor-room/model-lib';
import { PlusmarService } from '..';
import { getPageAppScopeByPageID, getUserScopePermission } from '../../data';

export class EcosystemService {
  async loginToMoreCommerce(pageID: number, userID: number): Promise<IHTTPResult> {
    const userScope = await getUserScopePermission(PlusmarService.readerClient, userID);
    if (!userScope.includes(EnumAuthScope.SOCIAL)) {
      return {
        status: 400,
        value: EnumAuthError.USER_APPLICATION_SCOPE_NOT_ALLOW,
      };
    }

    const pageAppScope = await getPageAppScopeByPageID(PlusmarService.readerClient, pageID);
    const isFound = pageAppScope.find((scope) => scope.app_scope === EnumAppScopeType.MORE_COMMERCE);
    if (!isFound) {
      return {
        status: 400,
        value: EnumAuthError.PAGE_APPLICATION_SCOPE_NOT_ALLOW,
      };
    }

    return {
      status: 200,
      value: 'ok',
    };
  }
}
