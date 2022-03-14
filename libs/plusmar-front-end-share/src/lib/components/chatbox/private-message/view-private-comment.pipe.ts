import { Pipe, PipeTransform } from '@angular/core';
import { IComment } from '@reactor-room/itopplus-model-lib';

@Pipe({
  name: 'viewPrivateComment',
})
export class ViewPrivateCommentPipe implements PipeTransform {
  transform(comment: IComment): string {
    try {
      const attachment = JSON.parse(<string>comment.attachment);
      if (attachment?.attachment?.type === 'sticker') {
        return attachment?.attachment?.url;
      } else {
        return 'attachments';
      }
    } catch (err) {
      return 'attachments';
    }
  }
}
