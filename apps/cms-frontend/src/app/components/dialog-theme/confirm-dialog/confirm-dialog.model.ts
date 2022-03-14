export interface ConfirmDialogModel {
  type: ConfirmDialogType;
  title: string;
  content?: string;
  checkbox?: IConfirmDilogCheckBox;
  btnLabels?: IConfirmDialogBtnLabels;
}

export interface IConfirmDilogCheckBox {
  isCheckBox: boolean;
  checkBoxLabel: string;
}

export interface IConfirmDialogBtnLabels {
  highlightBtn?: string;
  nonHighlightBtn?: string;
}

export enum ConfirmDialogType {
  ACTION = 'ACTION',
  DANGER = 'DANGER',
}

export interface IConfirmDialogResult {
  highlightBtn: boolean;
  checkBoxStatus: boolean;
}
