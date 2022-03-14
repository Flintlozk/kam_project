export enum GenericDialogMode {
  CONFIRM = 'CONFIRM', // 0
  SAVE_SUCCESS = 'SAVE_SUCCESS', // 1
  FAILED = 'FAILED', // 2
  REJECT = 'REJECT', // 3
  CAUTION = 'CAUTION', // 4
  NOT_CUSTOMER = 'NOT_CUSTOMER', // 5
  REFUND = 'REFUND', // 6
  COPY = 'COPY', // 7
}

export enum GenericButtonMode {
  DEFAULT = 'DEFAULT', // 0
  OK = 'OK', // 1
  YES_NO = 'YES_NO', // 2
  CONFIRM = 'CONFIRM', // 3
  CLOSE = 'CLOSE', // 4
}

export const GenericDialogToggle = {
  ENABLE: true,
  DISABLE: false,
};

export interface GenericDialogData {
  text: string;
  title: string;
  dialogMode: GenericDialogMode;
  buttonMode: GenericButtonMode;
  disableClose: boolean;
  isError: boolean;
  value: string | number;
}
