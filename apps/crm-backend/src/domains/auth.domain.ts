import {
  EnumAuthScope,
  EnumFeatureScope,
  IUserLevelPermission,
  LoginRespondingType,
  IStateCreateCondition,
  IUpdateTaskInput,
  ResponseValue,
  StateActionType,
  IVerifyRequiredField,
  IVerifyResult,
  StateOptions,
} from '@reactor-room/crm-models-lib';
import { CrmService, FeatureError, AuthError } from '@reactor-room/crm-services-lib';
import { cryptoDecode } from '@reactor-room/itopplus-back-end-helpers';
import type { IGQLContext, IPayload } from '@reactor-room/crm-models-lib';
import * as jwt from 'jsonwebtoken';
import {
  getAllUserInNewState,
  getAutoCreateByTaskUUID,
  getConditionInsertCross,
  getCountVerifyTaskDetail,
  getFirstStateIdFromWorkflow,
  getMoveToNextState,
  getPriorityofStateByUuidState,
  getUserDepartmentByUserId,
  getWorkflowSetting,
} from 'libs/crm-services-lib/src/lib/data/task/task.data';
import { getAccessTokenRedis } from 'libs/crm-services-lib/src/lib/data/redis';
import { verifyApproval, verifyRequiredField } from './auth-verify.domain';
import { environment } from '../environments/environment';

export function requireScope(allowScope?: EnumAuthScope[]) {
  return function (target: any): void {
    for (const key of Object.getOwnPropertyNames(target.prototype)) {
      let descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
      if (descriptor) {
        descriptor = requireLogin(allowScope)(target, key, descriptor);
        Object.defineProperty(target.prototype, key, descriptor);
      }
    }
  };
}

export function requireLogin(allowScope?: EnumAuthScope[]): (target: unknown, propertyName: string, propertyDesciptor: PropertyDescriptor) => PropertyDescriptor {
  return function (target: unknown, propertyName: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor {
    try {
      const method = propertyDesciptor.value;
      propertyDesciptor.value = async function (...args: any[]) {
        const context: IGQLContext = args[2];
        const payload = await verifyAndExtractPayload(context.access_token);
        context.payload = payload;
        const result = method.apply(this, args);
        if (allowScope.length > 0 && context.payload?.userLoginData) {
          if (!verifyAllowApplicationScope(allowScope, context.payload.userLoginData.is_admin)) {
            throw new AuthError(LoginRespondingType.APPLICATION_SCOPE_NOT_ALLOW);
          }
        } else {
          throw new AuthError(LoginRespondingType.APPLICATION_SCOPE_NOT_ALLOW);
        }
        return result;
      };
      return propertyDesciptor;
    } catch (err) {
      throw Error(err);
    }
  };
}
export function requirePermissionWorkFlow(): (target: unknown, propertyName: string, propertyDesciptor: PropertyDescriptor) => PropertyDescriptor {
  return function (target: unknown, propertyName: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor {
    try {
      const method = propertyDesciptor.value;
      propertyDesciptor.value = async function (...args: any[]) {
        const context: IGQLContext = args[2];
        const payload = await verifyAndExtractPayload(context.access_token);
        context.payload = payload;
        const useWorkFlow = args[1];
        let validate = false;
        context.payload.userWorkflow.forEach((workFlow) => {
          if (workFlow.flowId == useWorkFlow.flowId) {
            validate = true;
          }
        });
        if (!validate) {
          throw new AuthError(LoginRespondingType.WORK_FLOW_NOTE_ALLOW);
        }
        const result = method.apply(this, args);
        return result;
      };
      return propertyDesciptor;
    } catch (err) {
      throw Error(err);
    }
  };
}
export function requireUpdateTaskPermission(): (target: unknown, propertyName: string, propertyDesciptor: PropertyDescriptor) => PropertyDescriptor {
  return function (target: unknown, propertyName: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor {
    try {
      const method = propertyDesciptor.value;

      propertyDesciptor.value = async function (...args: any[]) {
        const context: IGQLContext = args[2];
        const taskUpdate = args[1];
        const allowCreateTask = await verifyCreateTask(
          taskUpdate.message,
          context.payload.taskCreateCondition,
          context.payload.userLoginData.ownerId,
          context.payload.userLoginData.userId,
        );
        if (!(await allowCreateTask?.value) && (await allowCreateTask?.type) === StateActionType.REQUIRED) {
          throw Error(ResponseValue.ASSIGNEE_REQUIRED);
        }
        if (!(await allowCreateTask?.value) && (await allowCreateTask?.type) === StateActionType.APPROVE) {
          throw Error(ResponseValue.DEPARTMENT_HAVE_NO_PERMISSION);
        }
        if ((await allowCreateTask?.value) && (await allowCreateTask?.type) === StateActionType.CREATE_AUTOMATE) {
          args[1].message.updateCross = false;
          args[1].message = { ...args[1].message, updateCrossRequired: allowCreateTask.value };
        } else {
          args[1].message.updateCross = true;
        }
        const result = method.apply(this, args);
        return result;
      };
      return propertyDesciptor;
    } catch (err) {
      throw Error(err);
    }
  };
}
export function requireDeleteTaskPermission(): (target: unknown, propertyName: string, propertyDesciptor: PropertyDescriptor) => PropertyDescriptor {
  return function (target: unknown, propertyName: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor {
    try {
      const method = propertyDesciptor.value;
      propertyDesciptor.value = async function (...args: any[]) {
        const context: IGQLContext = args[2];
        const ownerId = context.payload.userLoginData.ownerId;
        const taskUpdate = args[1];
        const allowToDeleteAutoCard = await getWorkflowSetting(CrmService.readerClient, taskUpdate.message.uuidState, ownerId);
        if (!allowToDeleteAutoCard.allow_to_delete_auto_card) {
          const isAutoCard = await getAutoCreateByTaskUUID(CrmService.readerClient, taskUpdate.message.uuidTask, ownerId);
          if (isAutoCard.is_auto_create) {
            throw Error(ResponseValue.CANNOT_DELETE);
          }
        }
        const result = method.apply(this, args);
        return result;
      };
      return propertyDesciptor;
    } catch (err) {
      throw Error(err);
    }
  };
}
export async function verifyCreateTask(userInput: IUpdateTaskInput, taskCreateConditions: IStateCreateCondition[], ownerId: number, userId: number): Promise<IVerifyResult> {
  const taskDetailCount = await getCountVerifyTaskDetail(CrmService.readerClient, userInput.uuidTask, ownerId);
  const userDepartment = await getUserDepartmentByUserId(CrmService.readerClient, userId, ownerId);
  const conditionInsertCrossInWorkFlow = await getConditionInsertCross(CrmService.readerClient, ownerId);
  const conditionsForThisState = taskCreateConditions.filter((condition) => condition.uuidState === userInput.uuidState);
  const allUserInWorkFlow = await getAllUserInNewState(CrmService.readerClient, conditionInsertCrossInWorkFlow[0].newState, ownerId);
  const conditionMoveNextStateOnly = await getMoveToNextState(CrmService.readerClient, userInput.uuidState, ownerId);

  if (conditionMoveNextStateOnly.allowNextStateOnly) {
    const priorityOfState = await getPriorityofStateByUuidState(CrmService.readerClient, userInput.uuidState, userInput.previousStatusType, ownerId);
    const priority = priorityOfState.map((priority) => priority.priority);
    if (Math.abs(priority[0] - priority[1]) !== 1) {
      throw Error(ResponseValue.ALLOW_MOVE_TO_NEXT_STATE_ONLY);
    }
  }
  let resultVerify;
  conditionsForThisState.forEach((condition) => {
    switch (condition.actionType) {
      case StateActionType.REQUIRED:
        resultVerify = { type: StateActionType.REQUIRED, value: verifyRequiredField(taskDetailCount, condition) };
        if (resultVerify.value === false) {
          if (condition.key === StateOptions.DEAL) {
            throw Error(ResponseValue.DEAL_REQUIRED);
          }
          if (condition.key === StateOptions.ASSIGNEE) {
            throw Error(ResponseValue.ASSIGNEE_REQUIRED);
          }
        }
        return resultVerify;
      case StateActionType.APPROVE:
        resultVerify = { type: StateActionType.APPROVE, value: verifyApproval(userDepartment, condition) };
        return resultVerify;
      case StateActionType.CREATE_AUTOMATE: {
        const { conditions, newState, stateName, team, uuidState } = conditionInsertCrossInWorkFlow[0];
        if (!userInput.updateCross) {
          resultVerify = {
            type: StateActionType.CREATE_AUTOMATE,
            value: { conditions: conditions, newState: newState, stateName: stateName, team: team, uuidState: uuidState, allUserInWorkFlow: allUserInWorkFlow },
          };
          return resultVerify;
        } else {
          return true;
        }
      }

      case StateActionType.NOTIFICATION:
        sendNotificationCreateTask(taskDetailCount, condition);
        break;
      default:
    }
  });
  return resultVerify;
}

function sendNotificationCreateTask(taskDetailCount: IVerifyRequiredField, createTaskAssignConditions: IStateCreateCondition): boolean {
  if (taskDetailCount[createTaskAssignConditions.key] >= createTaskAssignConditions[createTaskAssignConditions.key]) {
    return true;
  } else {
    throw Error(ResponseValue.ASSIGNEE_REQUIRED);
  }
}

export async function verifyAndExtractPayload(access_token: string): Promise<IPayload> {
  const token = access_token;
  const verifyTokenResult = await verifyToken(token);
  const redisSessionKey = cryptoDecode(verifyTokenResult, environment.pageKey);
  const value = await getAccessTokenRedis(redisSessionKey);
  if (!value) {
    throw new AuthError(LoginRespondingType.NO_DATA_FROM_RADIS_KEY);
  }
  return value;
}

export function verifyToken(token: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, environment.tokenKey, (err, payload) => {
        if (payload) {
          resolve(payload.toString());
        } else {
          reject(new AuthError(LoginRespondingType.AUTHENTICATION_ERROR));
        }
      });
    } catch (err) {
      reject(new AuthError(LoginRespondingType.ACCESS_DENY));
    }
  });
}

export function verifyAllowApplicationScope(allowScope: EnumAuthScope[], isAdmin: boolean): boolean {
  if (allowScope[0] === EnumAuthScope.ADMIN) {
    return isAdmin;
  } else {
    return true;
  }
}
export function requireTargetState(): (target: unknown, propertyName: string, propertyDesciptor: PropertyDescriptor) => PropertyDescriptor {
  return function (target: unknown, propertyName: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor {
    try {
      const method = propertyDesciptor.value;
      propertyDesciptor.value = async function (...args: any[]) {
        const workflow = args[1].message.workflow;
        const context: IGQLContext = args[2];
        const stateId = await getFirstStateIdFromWorkflow(CrmService.readerClient, workflow, context.payload.userLoginData.ownerId);
        args[1].message.stateId = stateId.stateId;
        const result = method.apply(this, args);
        return result;
      };
      return propertyDesciptor;
    } catch (err) {
      throw Error(err);
    }
  };
}

export function requireFeature(Feature?: EnumFeatureScope[]): (target: unknown, propertyName: string, propertyDesciptor: PropertyDescriptor) => PropertyDescriptor {
  return function (target: unknown, propertyName: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor {
    try {
      const method = propertyDesciptor.value;
      propertyDesciptor.value = function (...args: any[]) {
        const context: IGQLContext = args[2];
        if (Feature.length > 0) {
          if (!verifyAllowFeatureScope(Feature, context.payload.userPermission)) {
            throw new FeatureError('FEATURE_SCOPE_NOT_ALLOW');
          }
        } else {
          throw new FeatureError('FEATURE_SCOPE_NOT_ALLOW');
        }
        const result = method.apply(this, args);
        return result;
      };
      return propertyDesciptor;
    } catch (err) {
      throw Error(err);
    }
  };
}

function verifyAllowFeatureScope(functionScope: EnumFeatureScope[], allowScope: IUserLevelPermission[]) {
  if (functionScope[0] === EnumFeatureScope.IMPORTLEAD) {
    return allowScope[0].allow_to_imported;
  }
  if (functionScope[0] === EnumFeatureScope.CREATETASK) {
    return allowScope[0].allow_to_create_task;
  }
  if (functionScope[0] === EnumFeatureScope.CREATEDEAL) {
    return allowScope[0].allow_to_create_deal;
  }
}
