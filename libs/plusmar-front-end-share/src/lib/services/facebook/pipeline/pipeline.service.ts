import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { AudiencePlatformType } from '@reactor-room/model-lib';
import { ICustomerTemp, IMessageModel } from '@reactor-room/itopplus-model-lib';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { MessageService } from '../message/message.service';

@Injectable({
  providedIn: 'root',
})
export class PipelineService implements OnDestroy {
  credentials: ICustomerTemp;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private apollo: Apollo, private http: HttpClient, private messageService: MessageService) {
    this.credentials = JSON.parse(localStorage.getItem('customer')) as ICustomerTemp;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  sendPayload(audienceID: number, psid: string, step: string, platform: AudiencePlatformType): Observable<any> {
    const mutation = gql`
      mutation sendPayload($audienceID: Int, $psid: String, $step: String, $platform: String) {
        sendPayload(audienceID: $audienceID, psid: $psid, step: $step, platform: $platform) {
          _id
        }
      }
    `;
    return this.apollo
      .mutate({
        mutation,
        variables: {
          audienceID,
          psid,
          step,
          platform,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['sendPayload']),
      );
  }

  sendFormPayload(audienceID: number, psid: string, formID: number): Observable<any> {
    // TODO : ADD TYPE
    const mutation = gql`
      mutation sendFormPayload($audienceID: Int, $psid: String, $formID: Int) {
        sendFormPayload(audienceID: $audienceID, psid: $psid, formID: $formID) {
          _id
        }
      }
    `;
    return this.apollo
      .mutate({
        mutation,
        variables: {
          audienceID,
          psid,
          formID,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['sendFormPayload']),
      ) as Observable<any>; // TODO : ADD TYPE
  }

  sendFormLinePayload(audienceID: number, formID: number): Observable<IMessageModel> {
    const mutation = gql`
      mutation sendFormLinePayload($audienceID: Int, $formID: Int) {
        sendFormLinePayload(audienceID: $audienceID, formID: $formID) {
          _id
          mid
          text
          attachments
          audienceID
          pageID
          createdAt
          sentBy
          sender {
            user_id
            user_name
          }
        }
      }
    `;
    return this.apollo
      .mutate({
        mutation,
        variables: {
          audienceID,
          formID,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['sendFormLinePayload']),
      ) as Observable<IMessageModel>; // TODO : ADD TYPE
  }

  // sendProductPipeline(audienceID: number) {}

  // getByID(ID: string): Promise<IFacebookPipelineModel> {
  //   const query = gql`
  //     query create($ID: String) {
  //       getByID(ID: $ID) {
  //         _id
  //         audience_id
  //         page_id
  //         steps
  //       }
  //     }
  //   `;
  //   return this.apollo
  //     .query({
  //       query: query,
  //       variables: {
  //         ID: ID,
  //       },
  //     })
  //     .pipe(
  //       takeUntil(this.destroy$),
  //       map((x) => x.data['getByID']),
  //     )
  //     .toPromise();
  // }

  // create(pipelineInput: IFacebookPipelineModelInput, asd: string): Observable<IFacebookPipelineModel> {
  //   return this.apollo
  //     .mutate({
  //       mutation: CREATE_PIPELINE_MUTATION,

  //       variables: {
  //         pipelineInput: pipelineInput,
  //       },
  //     })
  //     .pipe(
  //       takeUntil(this.destroy$),
  //       map((x) => x.data['create']),
  //     );
  // }

  // update(pipelineID: string, stepIds: string[], asd: string): Observable<IFacebookPipelineModel> {
  //   return this.apollo
  //     .mutate({
  //       mutation: UPDATE_PIPELINE_MUTATION,
  //       variables: {
  //         ID: pipelineID,
  //         stepIds: stepIds,
  //       },
  //     })
  //     .pipe(
  //       takeUntil(this.destroy$),
  //       map((x) => x.data['update']),
  //     );
  // }
}
