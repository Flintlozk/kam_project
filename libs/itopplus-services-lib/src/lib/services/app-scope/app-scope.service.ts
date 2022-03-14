import { EnumAuthScope } from '@reactor-room/itopplus-model-lib';
import { addUserScopePermission, getUserScopePermission } from '../../data/app-scope/app-scope.data';
import { PlusmarService } from '../plusmarservice.class';
export class AppScopeService {
  constructor() {}
  async addUserScopePermission(appScope: EnumAuthScope, userID: number): Promise<boolean> {
    return await addUserScopePermission(PlusmarService.writerClient, appScope, userID);
  }
  async getUserScopePermission(userID: number): Promise<EnumAuthScope[]> {
    return await getUserScopePermission(PlusmarService.readerClient, userID);
  }
}
