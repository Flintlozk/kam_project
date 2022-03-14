import { ILineMessage } from './messages.model';
export interface ILineStickerMessage extends ILineMessage {
  sticker: string;
  packageId: string;
  stickerResourceType: string;
  keyword: [string];
}
