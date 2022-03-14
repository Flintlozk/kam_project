import { Pipe, PipeTransform } from '@angular/core';
import { IMessageModel, MessageSentByEnum } from '@reactor-room/itopplus-model-lib';

@Pipe({
  name: 'paramsRemover',
})
export class ParamsRemoverPipe implements PipeTransform {
  transform(url: string, ...args: [IMessageModel]): unknown {
    const [message] = args;
    if (message.object === 'line' && message.sentBy === MessageSentByEnum.PAGE) {
      if (url?.search('system') !== -1) {
        return url;
      } else {
        // if (url.indexOf('more-commerce.com/linestorage') !== -1) {
        const splitUrl = url.split('?');
        return splitUrl.length ? splitUrl[0] : url;
        // }
      }
    }
    return url;
  }
}
