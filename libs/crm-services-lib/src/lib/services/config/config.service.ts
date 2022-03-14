import {
  IGroupBoard,
  IGroupBoardFilter,
  IGroupState,
  IInsertLinkStateConfig,
  IStateConditionConfig,
  IStateNodeConfig,
  ITeamConfig,
  ITeamConfigFilter,
  IWorkflowDetail,
} from '@reactor-room/crm-models-lib';
import { CrmService } from '../crmservice.class';
import { getGroupState, getStateByGroup, getStateConditionByFlow, getTeamConfig, getWorkflowUser } from '../../data/config/config.data';

export class ConfigService {
  constructor() {}

  public static getTeamConfig = async (aliases: string, ownerId: string): Promise<ITeamConfig[]> => {
    return await getTeamConfig(CrmService.readerClient, aliases, ownerId);
  };

  public static getStateByGroup = async (aliases: string, ownerId: number): Promise<IStateNodeConfig[]> => {
    return await getStateByGroup(CrmService.readerClient, aliases, ownerId);
  };

  public static getStateConditionByFlow = async (flowId: string, ownerId: string): Promise<IStateConditionConfig[]> => {
    return await getStateConditionByFlow(CrmService.readerClient, flowId, ownerId);
  };
  public static getWorkflowUser = async (userId: number, ownerId: number): Promise<IWorkflowDetail[]> => {
    return await getWorkflowUser(CrmService.readerClient, userId, ownerId);
  };
  public static getGroupState = async (flowId: number, ownerId: number): Promise<IGroupState[]> => {
    return await getGroupState(CrmService.readerClient, flowId, ownerId);
  };
}
