export interface StatusSnackbarModel {
  type: StatusSnackbarType;
  message: string;
}

export enum StatusSnackbarType {
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
  WARNING = 'WARNING',
}
