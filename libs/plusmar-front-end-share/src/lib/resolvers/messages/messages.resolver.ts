import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { MessageService } from '@reactor-room/plusmar-front-end-share/services/facebook/message/message.service';
import { IMessageModel } from '@reactor-room/itopplus-model-lib';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class MessageResolver implements Resolve<IMessageModel[]> {
  constructor(private messageService: MessageService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IMessageModel[]> {
    return this.messageService.getMessages(+route.paramMap.get('ID')).pipe(take(1));
  }
}
