import { Injectable } from '@angular/core';
import { Observable } from '@apollo/client/core';
import { IMessageModel, MessageSentByEnum } from '@reactor-room/itopplus-model-lib';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
const DEFAULT_POLL_INTERVAL = 10000;
@Injectable()
export class MessageState {
  private pollInterval$ = new BehaviorSubject<number>(DEFAULT_POLL_INTERVAL);
  public localMessages$ = new BehaviorSubject<IMessageModel[][]>([]);
  private localMessageIndices: number[] = [];
  public messages$ = new BehaviorSubject<IMessageModel[]>([]);
  public hisotryMessages$ = new BehaviorSubject<IMessageModel[]>([]);

  // * These subject uses in Chatbox CMP
  public triggerSetChatRead = new Subject<void>();
  public triggerMoveToFollow = new Subject<void>();
  public triggerRedirectToNewCreatedAudience = new Subject<void>();
  public triggerScrollToLatestMessage = new Subject<boolean>();
  public triggerStopLoading = new Subject<boolean>();

  constructor() {}

  addNewMessage(message: IMessageModel): void {
    const oldMessages = this.messages$.value;
    this.messages$.next([...oldMessages, message]);
  }
  addOldMessage(message: IMessageModel[]): void {
    if (message) {
      const oldMessages = this.messages$.value;
      this.messages$.next([...message, ...oldMessages]);
    }
  }

  setMessages(messages: IMessageModel[]): void {
    this.messages$.next(messages);
  }
  setHistoryMessages(messages: IMessageModel[]): void {
    this.hisotryMessages$.next(messages);
  }

  addLocalMessages(messages: IMessageModel[]): number {
    const index = this.messages$.value.length + this.localMessageIndices.length;
    const i = this.localMessageIndices.push(index) - 1;
    const { value } = this.localMessages$;
    value.push(messages);
    this.localMessages$.next(value);
    return i;
  }

  deleteLocalMessage(index: number): void {
    const { value } = this.localMessages$;
    value.splice(index);
    this.localMessageIndices.splice(index);
    this.localMessages$.next(value);
  }

  deleteAllLocalMessage(): Observable<void> {
    return new Observable<void>((observer) => {
      this.localMessages$.next([]);
      const { value } = this.localMessages$;
      this.localMessageIndices.splice(value.length - 1);
      observer.next(null);
    });
  }
  deleteAllMessage(): Observable<void> {
    return new Observable<void>((observer) => {
      this.messages$.next([]);
      observer.next(null);
    });
  }

  deleteLastLocalMessage(): void {
    const { value } = this.localMessages$;
    value.splice(value.length - 1);
    this.localMessageIndices.splice(value.length - 1);
    this.localMessages$.next(value);
  }

  getMessages() {
    return combineLatest([this.messages$.asObservable(), this.localMessages$.asObservable()]).pipe(
      map(([messages, localMessages]) => {
        let tempMessages = [];
        if (messages) tempMessages = [...messages];
        const { length } = this.localMessageIndices;
        if (length > 0 && localMessages.length > 0) {
          for (let i = 0; i < length; i++) {
            tempMessages.splice(this.localMessageIndices[i], 0, ...localMessages[i]);
          }
        }
        return tempMessages;
      }),
    );
  }
  getHistoryMessages() {
    return this.hisotryMessages$.asObservable();
  }
  concatPreviousMessage(previousMessages: IMessageModel[], lastMessageElement: HTMLElement): void {
    const oldMessages = this.messages$.value;
    this.messages$.next([...previousMessages, ...oldMessages]);

    setTimeout(() => {
      try {
        lastMessageElement.scrollIntoView();
      } catch (err) {
        // prevent element as the ng reflect
      }
    });
  }
  setMessagesPollInterval(pollInterval = DEFAULT_POLL_INTERVAL): void {
    this.pollInterval$.next(pollInterval);
  }

  getMessagesPollInterval() {
    return this.pollInterval$.asObservable();
  }
  getLocalMessageLength(): number {
    return this.localMessageIndices.length;
  }

  getLatestCustomerMessage(): IMessageModel {
    const messages = this.messages$.getValue();
    const filtered = messages.filter((x) => x.sentBy === MessageSentByEnum.AUDIENCE);
    return filtered[filtered.length - 1];
  }

  replaceTheExpiredMessage(newMessage: IMessageModel) {
    const currentMessage = this.messages$.getValue();
    currentMessage.forEach((message) => {
      if (message.mid === newMessage.mid) {
        message.attachments = JSON.parse(newMessage.attachments as string);
      }
    });
    this.messages$.next(currentMessage);
  }
}
