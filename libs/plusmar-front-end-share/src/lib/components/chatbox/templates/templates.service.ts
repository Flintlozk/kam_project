import { Injectable } from '@angular/core';
import { IHTTPResult } from '@reactor-room/model-lib';
import {
  FormTemplate,
  ImageSetTemplate,
  ImageSetTemplateInput,
  IUploadImageSetResult,
  MessagePayload,
  MessageTemplates,
  MessageTemplatesFilters,
  Socials,
} from '@reactor-room/itopplus-model-lib';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TemplatesService {
  constructor(private apollo: Apollo) {}

  private messageSource = new Subject<{ payload: MessagePayload; type?: string }>();
  currentMessage = this.messageSource.asObservable();

  public returnMessageToComment = new Subject<string | { url: string }[]>();

  changeMessage(message: MessagePayload, type?: string): void {
    this.messageSource.next({ payload: message, ...(type && { type }) });
  }

  returnMessage(message: string | { url: string }[]): void {
    this.returnMessageToComment.next(message);
  }

  getMessageTemplates(filters: MessageTemplatesFilters): Observable<MessageTemplates[]> {
    const query = gql`
      query getMessageTemplates($filters: MessageTemplatesFiltersInput) {
        getMessageTemplates(filters: $filters) {
          totalrows
          id
          messages {
            text
            shortcut
          }
        }
      }
    `;
    return this.apollo
      .query({
        query,
        variables: {
          filters,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe<MessageTemplates[]>(map((x) => x.data['getMessageTemplates']));
  }

  addMessageTemplate(message): Observable<IHTTPResult> {
    const mutate = this.apollo.mutate({
      mutation: gql`
        mutation addMessageTemplate($message: MessageInput) {
          addMessageTemplate(message: $message) {
            status
            value
          }
        }
      `,
      variables: {
        message,
      },
    });

    return mutate.pipe(map((x) => x.data['addMessageTemplate']));
  }

  deleteMessageTemplate(id): Observable<IHTTPResult> {
    const mutate = this.apollo.mutate({
      mutation: gql`
        mutation deleteMessageTemplate($id: ID) {
          deleteMessageTemplate(id: $id) {
            status
            value
          }
        }
      `,
      variables: {
        id,
      },
    });

    return mutate.pipe(map((x) => x.data['deleteMessageTemplate']));
  }

  addImageSets(images_set: ImageSetTemplateInput): Observable<IUploadImageSetResult> {
    const mutate = this.apollo.mutate({
      mutation: gql`
        mutation addImageSets($images_set: ImagesSetInput) {
          addImageSets(images_set: $images_set) {
            status
            value
            failedList
          }
        }
      `,
      variables: {
        images_set,
      },
      context: {
        useMultipart: true,
      },
    });

    return mutate.pipe(map((x) => x.data['addImageSets']));
  }

  getImageSets(filters: MessageTemplatesFilters): Observable<ImageSetTemplate[]> {
    const query = gql`
      query getImageSets($filters: MessageTemplatesFiltersInput) {
        getImageSets(filters: $filters) {
          totalrows
          shortcut
          id
          images {
            url
            attachment_id
            extension
            filename
          }
        }
      }
    `;
    return this.apollo
      .query({
        query,
        variables: {
          filters,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe<ImageSetTemplate[]>(map((x) => x.data['getImageSets']));
  }

  deleteImageSets(id): Observable<IHTTPResult> {
    const mutate = this.apollo.mutate({
      mutation: gql`
        mutation deleteImageSets($id: ID) {
          deleteImageSets(id: $id) {
            status
            value
          }
        }
      `,
      variables: {
        id,
      },
    });

    return mutate.pipe(map((x) => x.data['deleteImageSets']));
  }

  deleteImageFromSet(set_id: number, image_index: number): Observable<IHTTPResult> {
    const mutate = this.apollo.mutate({
      mutation: gql`
        mutation deleteImageFromSet($set_id: ID, $image_index: ID) {
          deleteImageFromSet(set_id: $set_id, image_index: $image_index) {
            status
            value
          }
        }
      `,
      variables: {
        set_id,
        image_index,
      },
    });

    return mutate.pipe(map((x) => x.data['deleteImageFromSet']));
  }

  getFormsTemplates(filters: MessageTemplatesFilters): Observable<FormTemplate[]> {
    const query = gql`
      query getFormsTemplates($filters: FormTemplatesFiltersInput) {
        getFormsTemplates(filters: $filters) {
          id
          name
          totalrows
        }
      }
    `;
    return this.apollo
      .query({
        query,
        variables: {
          filters,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe<FormTemplate[]>(map((x) => x.data['getFormsTemplates']));
  }

  getSocials(): Observable<Socials> {
    const query = gql`
      query getSocials {
        getSocials {
          social_facebook
          social_line
          social_shopee
          social_lazada
        }
      }
    `;
    return this.apollo
      .query({
        query,
        fetchPolicy: 'no-cache',
      })
      .pipe<Socials>(map((x) => x.data['getSocials']));
  }

  updateSocials(socials): Observable<IHTTPResult> {
    const mutate = this.apollo.mutate({
      mutation: gql`
        mutation updateSocials($socials: SocialsInput) {
          updateSocials(socials: $socials) {
            status
            value
          }
        }
      `,
      variables: {
        socials,
      },
    });

    return mutate.pipe(map((x) => x.data['updateSocials']));
  }
}
