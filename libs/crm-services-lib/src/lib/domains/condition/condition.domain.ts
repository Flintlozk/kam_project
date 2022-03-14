import { IStateCreateCondition, ITaskUpdate, StateActionType, StateType } from '@reactor-room/crm-models-lib';

export const getDeleteAutoCreateTask = (taskCreateConditions: IStateCreateCondition[], updateTaskField: ITaskUpdate): boolean => {
  const conditionsTaskByPreviousState = taskCreateConditions.filter((condition) => condition.uuidState === updateTaskField.previousStatusType);
  const conditionsTaskByState = taskCreateConditions.filter((condition) => condition.uuidState === updateTaskField.uuidState);
  for (const condition of conditionsTaskByPreviousState) {
    if (condition.actionType === StateActionType.CREATE_AUTOMATE) {
      if (conditionsTaskByState[0].stateType !== StateType.CLOSE) {
        return true;
      }
    }
  }
  return false;
};
