import type { IGQLContext } from '@reactor-room/itopplus-model-lib';
import { EnumAuthScope } from '@reactor-room/itopplus-model-lib';
import { graphQLHandler } from '../graphql-handler';
import { requiredPermission, requireLogin } from '@reactor-room/itopplus-services-lib';
import { getAllUser, setInvitationUser } from '@reactor-room/cms-services-lib';
import { validateDefaultResponse } from '../../schema/default/default.schema';
import { EnumUserAppRole, ISmtpConfig } from '@reactor-room/model-lib';
import { environment } from '../../environments/environment';
import { validateSmtpConfigValidate } from '@reactor-room/itopplus-back-end-helpers';

import { validateUserInvitation, validateUserResponse } from '../../schema/user/user.schema';
class AdminController {
  public static instance: AdminController;
  public static getInstance(): AdminController {
    if (!AdminController.instance) AdminController.instance = new AdminController();
    return AdminController.instance;
  }
  @requireLogin([EnumAuthScope.ADMIN_CMS])
  async getAllUserHandler(parent, args, context: IGQLContext) {
    return await getAllUser();
  }

  @requireLogin([EnumAuthScope.ADMIN_CMS])
  @requiredPermission([EnumUserAppRole.CMS_ADMIN])
  async sendInvitation(parent, args, context: IGQLContext) {
    const {
      input: { email, role },
    } = args;
    const smptConfig = validateSmtpConfigValidate<ISmtpConfig>(environment.transporterConfig);
    const userInvitationValidate = validateUserInvitation({ email, role });
    return await setInvitationUser(userInvitationValidate, smptConfig);
  }
}
const admin: AdminController = AdminController.getInstance();
export const getUserManagement = {
  Query: {
    getAllUser: graphQLHandler({
      handler: admin.getAllUserHandler,
      validator: validateUserResponse,
    }),
  },
  Mutation: {
    sendInvitation: graphQLHandler({
      handler: admin.sendInvitation,
      validator: validateDefaultResponse,
    }),
  },
};
