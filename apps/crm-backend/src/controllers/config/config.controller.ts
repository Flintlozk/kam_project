import { EnumAuthScope, IFilterByFlowId, IGroupState, IStateNodeConfig, ITeamConfig, ITeamConfigFilter, IWorkflowDetail } from '@reactor-room/crm-models-lib';
import type { IGQLContext } from '@reactor-room/crm-models-lib';
import { ConfigService } from '@reactor-room/crm-services-lib';
import { graphQLHandler } from '../graphql-handler';

import {
  validatConfigStateRequest,
  validateConfigFlowRequest,
  validateStateByGroup,
  validateTeamConfigResponse,
  validateWorkFlowDetail,
  validatorGroupState,
} from '../../schema/config/config.schema';
import { requirePermissionWorkFlow, requireScope } from '../../domains/auth.domain';

@requireScope([EnumAuthScope.ADMIN])
class Config {
  public static instance;
  public static Config: Config;
  public static getInstance() {
    if (!Config.instance) Config.instance = new Config();
    return Config.instance;
  }

  async getTeamConfigHandler(parent, args: ITeamConfigFilter, context: IGQLContext): Promise<ITeamConfig[]> {
    const { uuidState } = validatConfigStateRequest(args);
    const data = await ConfigService.getTeamConfig(uuidState, context.payload.userLoginData.uuidOwner);
    return data;
  }

  async getStateByGroupHandler(parent, args: IFilterByFlowId, context: IGQLContext): Promise<IStateNodeConfig[]> {
    const { flowId } = validateConfigFlowRequest(args);
    const data = await ConfigService.getStateByGroup(flowId, context.payload.userLoginData.ownerId);
    return data;
  }

  async getWorkFlowUserHandler(parent, args, context: IGQLContext): Promise<IWorkflowDetail[]> {
    const data = await ConfigService.getWorkflowUser(context.payload.userLoginData.userId, context.payload.userLoginData.ownerId);
    return data;
  }
  @requirePermissionWorkFlow()
  async getGroupStateGroupHandler(parent, args, context): Promise<IGroupState[]> {
    const { flowId } = validateConfigFlowRequest(args);
    return await ConfigService.getGroupState(flowId, context.payload.userLoginData.ownerId);
  }
}

const config: Config = Config.getInstance();

export const configResolver = {
  getStateByGroup: {
    teamConfigState(parent: IStateNodeConfig, args, context: IGQLContext): Promise<ITeamConfig[]> {
      return configResolver.Query.getTeamConfig(parent, { filters: parent.uuidState }, context);
    },
  },
  getGroupState: {
    state(parent: IGroupState, args, context: IGQLContext): Promise<IStateNodeConfig[]> {
      return configResolver.Query.getStateByGroup(parent, { flowId: parent.flowId }, context);
    },
  },
  Query: {
    getTeamConfig: graphQLHandler({
      handler: config.getTeamConfigHandler,
      validator: validateTeamConfigResponse,
    }),
    getStateByGroup: graphQLHandler({
      handler: config.getStateByGroupHandler,
      validator: validateStateByGroup,
    }),
    getWorkFlowUser: graphQLHandler({
      handler: config.getWorkFlowUserHandler,
      validator: validateWorkFlowDetail,
    }),
    getGroupState: graphQLHandler({
      handler: config.getGroupStateGroupHandler,
      validator: validatorGroupState,
    }),
  },
};
