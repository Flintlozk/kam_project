import { IStateCreateCondition, IVerifyRequiredField } from '@reactor-room/crm-models-lib';

export function verifyApproval(statusCreate: { departmentId: string }[], createTaskAssignConditions: IStateCreateCondition): boolean {
  const deparmentId = statusCreate.map((element) => parseInt(element.departmentId, 10));
  if (deparmentId.includes(createTaskAssignConditions.value)) {
    return true;
  }
  return false;
}
export function verifyInsertCross(statusCreate: string, createTaskAssignConditions: IStateCreateCondition): boolean {
  if (createTaskAssignConditions.value.length > 0 && statusCreate !== 'Approved') {
    return false;
  } else {
    return true;
  }
}
export function verifyRequiredField(taskDetailCount: IVerifyRequiredField, createTaskAssignConditions: IStateCreateCondition): boolean {
  if (taskDetailCount[createTaskAssignConditions.key] >= createTaskAssignConditions[createTaskAssignConditions.key]) {
    return true;
  } else {
    return false;
  }
}
