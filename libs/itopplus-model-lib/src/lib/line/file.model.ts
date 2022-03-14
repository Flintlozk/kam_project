import { ILineMessage } from './messages.model';

export interface ILineFileMessage extends ILineMessage {
  contentProvider: ILineFileContentProvider;
  fileName: string;
  fileSize: number;
}

export interface ILineFileContentProvider {
  type: string;
}
