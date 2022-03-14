export enum EnumAuthScope {
  MEMBER = 'MEMBER',
  ADMIN = 'ADMIN',
}

export enum EnumFeatureScope {
  IMPORTLEAD = 'IMPORTLEAD',
  CREATETASK = 'CREATETASK',
  CREATEDEAL = 'CREATEDEAL',
}
export interface IVerifyResult {
  type: string;
  value: any;
}
