export interface StatusDialogModel {
  type: StatusDialogType;
  title: string;
  content: string;
}

export enum StatusDialogType {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
}
