import { Injectable } from '@angular/core';
import { PureQueryOptions } from '@apollo/client/core/types';
import { deepCopy, parseObject } from '@reactor-room/itopplus-front-end-helpers';
import { IHTTPResult } from '@reactor-room/model-lib';
import {
  FacebookMessagingType,
  IAttachmentsModel,
  ICheckMessageActivity,
  IFacebookMessageResponse,
  IFacebookUploadAttachmentResponse,
  IHTTPResultLineUpload,
  ILineUpload,
  Image,
  IMessageModel,
  IMessageWatermark,
} from '@reactor-room/itopplus-model-lib';
import { Apollo } from 'apollo-angular';
import { isEmpty } from 'lodash';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ADD_LINE_MESSAGE,
  ADD_MESSAGE,
  CHECK_MESSAGE_ACTIVITY,
  GET_ATTACHMENTS_URL_EXPIRED,
  GET_LATEST_MESSAGE,
  GET_MESSAGES,
  GET_MESSAGES_ON_SCROLL,
  GET_MESSAGES_WATERMARK,
  GET_MESSAGE_ATTACHEMENTS,
  LINE_UPLOAD,
  MESSAGE_RECEIVED,
  SEND_ATTACHMENT,
  SEND_IMAGE_SET,
  SEND_PRIVATE_MESSAGE,
  UPDATE_MESSAGE,
  UPLOAD_ATTACHMENT,
} from './message.query';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  constructor(private apollo: Apollo) {}

  private leadFormDialogListener = new Subject<boolean>();
  private isLeadFormSubmitted = new Subject<boolean>();
  private quickPayMessageListener = new Subject<IMessageModel>();

  getLeadFormDialogListener$ = this.leadFormDialogListener.asObservable();
  getIsLeadFormSubmitted$ = this.isLeadFormSubmitted.asObservable();
  getMessageFormQuickpay$ = this.quickPayMessageListener.asObservable();

  triggerQuickPayMessage(message: IMessageModel): void {
    this.quickPayMessageListener.next(message);
  }

  setLeadFormDialogListener(flag: boolean): void {
    this.leadFormDialogListener.next(flag);
  }

  setIsLeadFormSubmitted(flag: boolean): void {
    this.isLeadFormSubmitted.next(flag);
  }

  getAllMessages(audienceID: number): Observable<IMessageModel[]> {
    return this.apollo
      .query({
        query: GET_MESSAGES,
        variables: {
          audienceID: Number(audienceID),
        },
        fetchPolicy: 'network-only',
      })
      .pipe(
        map((x) => x.data['getMessages']),
        map((messages) => this.parseMessageAttachments(messages)),
      );
  }

  getMessageAttachments(audienceID: number, limit: number): Observable<IMessageModel[]> {
    return this.apollo
      .query({
        query: GET_MESSAGE_ATTACHEMENTS,
        variables: {
          audienceID: Number(audienceID),
          limit,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        map((x) => x.data['getMessageAttachments']),
        map((messages) => this.parseMessageAttachments(messages)),
      );
  }

  getMessagesOnScroll(audienceID: number, index: number, limit: number): Observable<IMessageModel[]> {
    return this.apollo
      .query({
        query: GET_MESSAGES_ON_SCROLL,
        variables: {
          audienceID: Number(audienceID),
          index: index,
          limit: limit,
        },
        fetchPolicy: 'network-only',
      })
      .pipe(
        map((x) => x.data['getMessagesOnScroll']),
        map((messages) => this.parseMessageAttachments(messages)),
      );
  }

  getMessages(audienceID: number, pollInterval = 10000): Observable<IMessageModel[]> {
    return this.apollo
      .watchQuery({
        query: GET_MESSAGES,
        variables: {
          audienceID: Number(audienceID),
        },
        pollInterval,
        fetchPolicy: 'network-only',
      })
      .valueChanges.pipe(
        map((x) => x.data['getMessages']),
        map((messages) => this.parseMessageAttachments(messages)),
      );
  }
  getMessageWatermark(PSID: string): Observable<IMessageWatermark> {
    return this.apollo
      .watchQuery({
        query: GET_MESSAGES_WATERMARK,
        variables: {
          PSID,
        },
        fetchPolicy: 'no-cache',
        pollInterval: 2000,
      })
      .valueChanges.pipe(map((x) => x.data['getMessageWatermark']));
  }
  getPreviousMessages(audienceID: number): Observable<IMessageModel[]> {
    return this.apollo
      .query({
        query: GET_MESSAGES,
        variables: {
          audienceID: Number(audienceID),
        },
        fetchPolicy: 'network-only',
      })
      .pipe(
        map((x) => x.data['getMessages']),
        map((messages) => this.parseMessageAttachments(messages)),
      );
  }
  checkMessageActivity(audienceID: number): Observable<ICheckMessageActivity> {
    return this.apollo
      .query({
        query: CHECK_MESSAGE_ACTIVITY,
        variables: {
          audienceID: Number(audienceID),
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((x) => x.data['checkMessageActivity']));
  }
  getMessagesSubscription(audienceID: number): Observable<IMessageModel> {
    return this.apollo
      .subscribe({
        query: MESSAGE_RECEIVED,
        fetchPolicy: 'no-cache',
        variables: {
          audienceID: audienceID,
        },
      })
      .pipe(
        map((x) => x.data['messageReceived']),
        map((message) => this.parseMessageAttachment(message)),
      );
  }

  getLatestMessage(audienceID: number): Observable<IMessageModel> {
    return this.apollo
      .query({
        query: GET_LATEST_MESSAGE,
        variables: {
          audienceID: Number(audienceID),
        },
        fetchPolicy: 'network-only',
      })
      .pipe(map((x) => x.data['getLatestMessage']));
  }

  getMessagesRefetch(message: IMessageModel): PureQueryOptions[] {
    const queryOptions: PureQueryOptions[] = [
      {
        query: GET_MESSAGES,
        variables: {
          audienceID: Number(message.audienceID),
        },
      },
    ];

    return queryOptions;
  }

  parseMessageAttachment(message: IMessageModel): IMessageModel {
    const isPayloadExist = message?.payload;
    const isTemplateMessage = message?.text === 'template message';
    const isLineObject = message?.object === 'line';
    const isMessageTypeText = message?.messagetype === 'text';
    // const isSentByPage = message?.sentBy === 'PAGE';
    const isReturnPayload = isPayloadExist || isTemplateMessage || isLineObject || isMessageTypeText;
    return {
      ...message,
      attachments: message?.attachments && !isEmpty(message?.attachments) ? parseObject(message.attachments) : undefined,
      payload: isReturnPayload ? (message?.payload && !isEmpty(message?.payload) ? parseObject(message.payload) : undefined) : undefined,
    };
  }
  parseMessageAttachments(messages: IMessageModel[]): IMessageModel[] {
    messages = deepCopy(messages);
    if (messages) {
      return messages.map(this.parseMessageAttachment);
    }
  }

  updateMessage(message: IMessageModel): Observable<IMessageModel> {
    return this.apollo
      .mutate({
        mutation: UPDATE_MESSAGE,
        variables: {
          message: message,
        },
      })
      .pipe(map((x) => x.data['updateMessage']));
  }

  addMessage(message: IMessageModel, messageType = FacebookMessagingType.RESPONSE): Observable<IMessageModel> {
    return this.apollo
      .mutate({
        mutation: ADD_MESSAGE,
        variables: {
          message: message,
          messageType: messageType,
        },
        refetchQueries: this.getMessagesRefetch(message),
        awaitRefetchQueries: false,
        optimisticResponse: {
          __typename: 'Mutation',
          addMessage: { ...message, pageID: null, _id: null },
        },
        update: (proxy, { data }) => this.updateMessageCache(proxy, data, message),
      })
      .pipe(map((x) => x.data['addMessage']));
  }

  sendLineMessage(message: IMessageModel): Observable<IMessageModel> {
    return this.apollo
      .mutate({
        mutation: ADD_LINE_MESSAGE,
        variables: {
          message: message,
        },
      })
      .pipe(map((x) => x.data['sendLineMessage']));
  }

  updateMessageCache(proxy, { addMessage }, message: IMessageModel): void {
    try {
      const cache = proxy.readQuery({
        query: GET_MESSAGES,
        variables: { audienceID: Number(message.audienceID) },
      });
      if (cache && cache.hasOwnProperty('getMessages')) {
        cache['getMessages'].push(addMessage);
        proxy.writeQuery({ query: GET_MESSAGES, cache });
      }
    } catch (err) {}
  }

  sendPrivateMessage(message: IMessageModel, commentID: string): Observable<IFacebookMessageResponse> {
    return this.apollo
      .mutate({
        mutation: SEND_PRIVATE_MESSAGE,
        variables: {
          message: message,
          commentID: commentID,
        },
        refetchQueries: this.getMessagesRefetch(message),
      })
      .pipe(map((x) => x?.['data']['sendPrivateMessage']));
  }

  uploadAttachment(file: File, audienceID: number): Observable<IFacebookUploadAttachmentResponse> {
    return this.apollo
      .mutate({
        mutation: UPLOAD_ATTACHMENT,
        variables: {
          file,
          audienceID,
        },
        context: {
          useMultipart: true,
        },
      })
      .pipe(map((x) => x.data['uploadAttachment']));
  }
  sendAttachment(audienceID: number, attachmentID: string, type: string): Observable<IFacebookMessageResponse> {
    return this.apollo
      .mutate({
        mutation: SEND_ATTACHMENT,
        variables: {
          audienceID,
          attachmentID,
          type,
        },
      })
      .pipe(map((x) => x.data['sendAttachment']));
  }

  sendImageSet(image: Image, psid: string): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: SEND_IMAGE_SET,
        variables: {
          image,
          psid,
        },
      })
      .pipe(map((x) => x.data['sendImageSet']));
  }

  lineUpload(lineUploadParam: ILineUpload): Observable<IHTTPResultLineUpload> {
    const mutate = this.apollo.mutate({
      mutation: LINE_UPLOAD,
      variables: {
        lineUploadInput: lineUploadParam,
      },
      context: {
        useMultipart: true,
      },
    });

    return mutate.pipe(map((x) => x.data['lineUpload']));
  }

  getAttachmentUrlExpired(message: IMessageModel): Observable<IMessageModel> {
    const mid = message.mid;
    const attachments = (message.attachments as IAttachmentsModel[]).map((attachment) => attachment.payload);
    const query = this.apollo.query({
      query: GET_ATTACHMENTS_URL_EXPIRED,
      variables: {
        mid,
        attachments,
      },
    });

    return query.pipe(map((x) => x.data['getAttachmentUrlExpired']));
  }
}
