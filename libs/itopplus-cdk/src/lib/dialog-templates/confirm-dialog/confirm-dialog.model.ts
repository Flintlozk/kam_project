export interface ConfirmDialogModel {
  type: ConfirmDialogType;
  title: string;
  content: string;
}

export enum ConfirmDialogType {
  ACTION = 'ACTION',
  DANGER = 'DANGER',
}
