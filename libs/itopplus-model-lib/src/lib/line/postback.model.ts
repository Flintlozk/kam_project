import { ILineMessage } from './messages.model';
export interface ILinePostbackEvent extends ILineMessage {
  data: string;
}
