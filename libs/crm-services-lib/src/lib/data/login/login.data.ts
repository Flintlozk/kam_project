import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { ICrmFlowName, ICrmUserDetail, IStateCreateCondition, IUserLevelPermission } from '@reactor-room/crm-models-lib';
import axios from 'axios';
import { Pool } from 'pg';
import * as jwt from 'jsonwebtoken';

import { ILoginDataGoogle, ILoginResponse, LoginRespondingType } from '@reactor-room/crm-models-lib';
import { IHTTPResult } from '@reactor-room/model-lib';
export async function getUserGoogleByEmail(client: Pool, userEmail: string): Promise<ICrmUserDetail> {
  const SQL = `
      SELECT 
        uuid_user AS uuiduser,
        username,
        email,
        us.uuid_owner AS uuidOwner,
        us.owner_id AS "ownerId",
        us.user_id AS "userId",
        is_admin,
        profile_pic AS "profilePic",
        flow_id As "flowId",
        uud.department_id as "departmentId",
        oc.owner_pic_link as "ownerPicLink"
      FROM 
        usr us
      LEFT JOIN
        user_department_mapping uud ON us.user_id = uud.user_id
      LEFT JOIN
        department_workflow_mapping dwm ON dwm.department_id = uud.department_id
      LEFT JOIN
        ownercrm oc On oc.owner_id = us.owner_id
      WHERE 
        email = $1
      ORDER BY
        flow_id
      `;

  const result = await PostgresHelper.execQuery<[ICrmUserDetail]>(client, SQL, [userEmail]);
  return result.length > 0 ? result[0] : null;
}
export async function getUserWorkflowByUserDepartment(client: Pool, userDepartment: number): Promise<ICrmFlowName[]> {
  const SQL = `
      SELECT 
        flow_name as flowname,
        wf.flow_id as "flowId"         
      FROM 
        department_workflow_mapping dwm
      LEFT JOIN
        workflow wf on dwm.flow_id = wf.flow_id 
      WHERE 
        department_id = $1
      ORDER BY
        dwm.flow_id
      `;

  const result = await PostgresHelper.execQuery<[ICrmFlowName]>(client, SQL, [userDepartment]);
  return result.length > 0 ? result : null;
}
export async function updateUserProfileFromGoogle(client: Pool, userEmail: string, profilePic: string): Promise<IHTTPResult> {
  try {
    const SQL = `
      UPDATE 
        usr
      SET 
        profile_pic = $1 
      WHERE 
        email = $2`;
    await PostgresHelper.execQuery<[IHTTPResult]>(client, SQL, [profilePic, userEmail]);
    return { status: 200, value: true };
  } catch (err) {
    return { status: 500, value: err };
  }
}

export async function getUserScopePermission(client: Pool, userId: number, ownerId: number): Promise<IUserLevelPermission[]> {
  const SQL = `
  SELECT allow_to_imported,allow_to_create_deal,allow_to_create_task FROM department_workflow_permission uu 
  LEFT JOIN department_workflow_mapping tt on tt.department_mapping_id  = uu.department_mapping_id
  LEFT JOIN user_department_mapping ss on ss.department_id = tt.department_id
  LEFT JOIN usr  aa on aa.user_id = ss.user_id
  WHERE
  aa.user_id = $1 AND aa.owner_id = $2
  `;
  const result = await PostgresHelper.execQuery<IUserLevelPermission[]>(client, SQL, [userId, ownerId]);
  if (result.length > 0) return result;
  else return [];
}

export async function getPermissionCreate(client: Pool, userId: number, ownerId: number): Promise<IStateCreateCondition[]> {
  const SQL = `
  SELECT 
  ws.uuid_state as "uuidState",
  wsc.state_id as "stateId",
  wsc.action_type as "actionType",
  json_extract_path(wsc."options" ::json,'assignee') as assignee ,
  json_extract_path(wsc."options" ::json,'deal') as deal,
  objects.*,
  ws.state_type as "stateType"
  FROM workflow_state_create_conditions wsc
  LEFT JOIN workflow_state ws  ON ws.state_id  = wsc.state_id,
  json_each(wsc."options") objects
  WHERE ws.flow_id  = ANY(SELECT flow_id FROM department_workflow_mapping  
  WHERE department_id = (SELECT department_id FROM user_department_mapping WHERE user_id = $1 LIMIT 1))
  `;
  const result = await PostgresHelper.execQuery<IStateCreateCondition[]>(client, SQL, [userId]);
  if (result.length > 0) return result;
  else return [];
}

export async function getGoogleUserByAccessToken(token: string): Promise<ILoginDataGoogle> {
  const dataFromGoogle = await (await axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${token}`)).data;
  const returnData: ILoginDataGoogle = { email: dataFromGoogle.email, pictureUrl: dataFromGoogle.picture };
  return returnData;
}

export async function signJWTPayload(payload: string, tokenKey: string): Promise<string> {
  if (payload === null) {
    return '';
  } else {
    const token = await jwt.sign(payload, tokenKey);

    return token;
  }
}
export function verifyToken(token: string, tokenKey: string): ILoginResponse {
  const result: ILoginResponse = { value: LoginRespondingType.ACCESS_DENY, status: 500, name: '', defaultWorkflow: '', ownerPicLink: '' };
  try {
    jwt.verify(token, tokenKey, (err, decoded) => {
      if (decoded) {
        const value = decoded;
        return { value, status: 200, name: '', defaultWorkflow: '', ownerPicLink: '' };
      } else {
        return result;
      }
    });
  } catch (err) {
    new Error(LoginRespondingType.ACCESS_DENY);
    return null;
  }
}
