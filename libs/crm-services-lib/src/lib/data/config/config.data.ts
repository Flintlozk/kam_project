import { IGroupState, IStateConditionConfig, IStateNodeConfig, ITeamConfig, IWorkflowDetail } from '@reactor-room/crm-models-lib';
import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';

import { Pool } from 'pg';

export async function getTeamConfig(client: Pool, aliases: string, ownerId: string): Promise<ITeamConfig[]> {
  const query = `
  SELECT 
    *
  FROM 
    task_config_statecondition t  
  WHERE 
    t."uuidState" = $1 and uuidOwner = $2
    `;

  const data = await PostgresHelper.execQuery<ITeamConfig[]>(client, query, [aliases, ownerId]);
  if (data.length > 0) return data;
  return [];
}
export async function getStateByGroup(client: Pool, flowId: string, ownerId: number): Promise<IStateNodeConfig[]> {
  const query = `
  SELECT 
    uuid_state as "uuidState",
    state_name as statename,priority,
    flow_name as team,
    color,state_name as text 
  FROM 
    workflow_state ws
  LEFT JOIN
    workflow wf on wf.flow_id = ws.flow_id
  WHERE 
    ws.flow_id = $1
    AND wf.owner_id = $2 
  ORDER BY priority
      `;
  const data = await PostgresHelper.execQuery<IStateNodeConfig[]>(client, query, [flowId, ownerId]);
  return data;
}

export async function getStateConditionByFlow(client: Pool, flowId: string, ownerId: string): Promise<IStateConditionConfig[]> {
  const query = `
  SELECT 
    source,
    destination,
    from_port as "formPort",
    to_port as "toPort",
    flow_id as key,
    condition as text 
  FROM 
    workflow_state_create_conditions 
  WHERE 
    flow_id = $1
    AND owner_id = $2 
      `;
  const data = await PostgresHelper.execQuery<IStateConditionConfig[]>(client, query, [flowId]);
  return data;
}
export async function getWorkflowUser(client: Pool, userId: number, ownerId: number): Promise<IWorkflowDetail[]> {
  const query = `
  SELECT 
    dwm.flow_id as "flowId",
    wg."name" as "workflowNameGroup",
    w2.flow_name as "name"
  FROM 
    usr u
  LEFT JOIN 
    user_department_mapping ud ON ud.user_id  = u.user_id 
  LEFT JOIN 
    department_workflow_mapping dwm ON dwm.department_id  = ud.department_id 
  LEFT JOIN 
    workflow w2 ON w2.flow_id  = dwm.flow_id 
  LEFT JOIN 
    workflow_group wg  ON wg .workflow_group_id  = w2.workflow_group_id 
  WHERE 
    u.user_id  =  $1 AND u.owner_id = $2
  ORDER BY
   dwm.flow_id
    `;
  const data = await PostgresHelper.execQuery<IWorkflowDetail[]>(client, query, [userId, ownerId]);
  return data;
}
export async function getGroupState(client: Pool, flowId: number, ownerId: number): Promise<IGroupState[]> {
  const query = `
  SELECT 
    fullname AS "fullName",
    allow_to_edit AS "allowToEdit",
    flow_id AS "flowId"
  FROM 
    workflow 
  WHERE 
    flow_id = $1 
    AND owner_id = $2
    `;

  const data = await PostgresHelper.execQuery<IGroupState[]>(client, query, [flowId, ownerId]);
  if (data.length > 0) return data;
  return [];
}
