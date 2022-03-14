import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Injectable, OnDestroy } from '@angular/core';

import { Observable, Subject, from } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import {
  IGetConfigFiltersInput,
  IGroupBoardFilter,
  ITeamConfig,
  IStateNodeConfig,
  IGroupBoard,
  IStateConditionConfig,
  IInsertLinkStateConfig,
  IWorkflowDetail,
} from '../flow-config.model';
import { IHTTPResult } from '@reactor-room/model-lib';

@Injectable({
  providedIn: 'root',
})
export class FlowConfigService implements OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private apollo: Apollo) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  getTeamConfig(filters: IGetConfigFiltersInput): Observable<ITeamConfig[]> {
    return this.apollo
      .watchQuery({
        query: gql`
          query getTeamConfig($filters: GetTeamConfigInput) {
            getTeamConfig(filters: $filters) {
              teamname
              source
              destination
              required
            }
          }
        `,
        variables: {
          filters: filters,
        },
      })
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getTeamConfig']),
      );
  }
  getWorkFlowUser(): Observable<IWorkflowDetail[]> {
    return this.apollo
      .watchQuery({
        query: gql`
          query getWorkFlowUser {
            getWorkFlowUser {
              flowId
              workflowNameGroup
              name
            }
          }
        `,
        fetchPolicy: 'no-cache',
      })
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getWorkFlowUser']),
      );
  }
  getStateConditionByFlow(flowId: string): Observable<IStateConditionConfig[]> {
    return this.apollo
      .watchQuery({
        query: gql`
          query getStateConditionByFlow($flowId: String) {
            getStateConditionByFlow(flowId: $flowId) {
              key
              source
              destination
              fromPort
              toPort
              text
            }
          }
        `,
        variables: {
          flowId: flowId,
        },
      })
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getStateConditionByFlow']),
      );
  }

  getGroupState(flowId: string): Observable<any[]> {
    return this.apollo
      .watchQuery({
        query: gql`
          query getGroupState($flowId: String) {
            getGroupState(flowId: $flowId) {
              allowToEdit
              fullName
              state {
                statename
                priority
                team
                color
                text
                key
                uuidState
              }
            }
          }
        `,
        variables: {
          flowId: flowId,
        },
      })
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getGroupState']),
      );
  }

  insertLinkStateCondition(message: IInsertLinkStateConfig): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation insertLinkStateCondition($message: InsertLinkStateConfig) {
            insertLinkStateCondition(message: $message) {
              status
              value
            }
          }
        `,
        variables: {
          message: message,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['insertLinkStateCondition']),
      );
  }
}
