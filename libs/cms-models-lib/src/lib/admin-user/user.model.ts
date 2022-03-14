import { EnumUserAppRole } from '@reactor-room/model-lib';
export interface IUserAppRole {
  user_id: number;
  role: EnumUserAppRole;
  id: number;
}

export interface IUserResponseData {
  name?: string;
  email: string;
  role: EnumUserAppRole;
}

export interface IInvitation {
  email: string;
  role: EnumUserAppRole;
}
