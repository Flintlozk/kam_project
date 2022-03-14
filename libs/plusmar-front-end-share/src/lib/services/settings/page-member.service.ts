import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IPageMemberModel, IPageMemberInviteInput, EnumPageMemberType } from '@reactor-room/itopplus-model-lib';
import { IHTTPResult } from '@reactor-room/model-lib';

@Injectable({
  providedIn: 'root',
})
export class PageMemberService {
  constructor(private ngZone: NgZone, private router: Router, private apollo: Apollo) {}

  setPageMemberAlias(userID: number, alias: string): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation setPageMemberAlias($userID: Int, $alias: String) {
            setPageMemberAlias(userID: $userID, alias: $alias) {
              status
            }
          }
        `,
        variables: {
          userID: userID,
          alias,
        },
        refetchQueries: ['getPageMembersByPageID', 'getPageMemberDetail'],
      })
      .pipe<IHTTPResult>(map((x) => x.data['setPageMemberAlias']));
  }
  setPageMemberNotifyEmail(userID: number, email: string): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation setPageMemberNotifyEmail($userID: Int, $email: String) {
            setPageMemberNotifyEmail(userID: $userID, email: $email) {
              status
            }
          }
        `,
        variables: {
          userID: userID,
          email,
        },
        refetchQueries: ['getPageMembersByPageID', 'getPageMemberDetail'],
      })
      .pipe<IHTTPResult>(map((x) => x.data['setPageMemberNotifyEmail']));
  }

  setPageMemberRole(userID: number, role: EnumPageMemberType): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation setPageMemberRole($userID: Int, $role: String) {
            setPageMemberRole(userID: $userID, role: $role) {
              status
            }
          }
        `,
        variables: {
          userID,
          role,
        },
        refetchQueries: ['getPageMembersByPageID', 'getPageMemberDetail'],
      })
      .pipe<IHTTPResult>(map((x) => x.data['setPageMemberRole']));
  }

  getPageMembersByPageID(): Observable<IPageMemberModel[]> {
    const result = this.apollo
      .watchQuery({
        query: gql`
          query getPageMembersByPageID {
            getPageMembersByPageID {
              id
              page_id
              user_id
              name
              alias
              email
              role
              is_active
              notify_email
            }
          }
        `,
        fetchPolicy: 'no-cache',
      })
      .valueChanges.pipe<[IPageMemberModel]>(map((x) => x.data['getPageMembersByPageID']));
    return result;
  }

  getPageMembersAmountByPageID(): Observable<{ amount_of_users: number }> {
    const result = this.apollo
      .watchQuery({
        query: gql`
          query getPageMembersAmountByPageID {
            getPageMembersAmountByPageID {
              amount_of_users
            }
          }
        `,
        fetchPolicy: 'no-cache',
      })
      .valueChanges.pipe<{ amount_of_users: number }>(map((x) => x.data['getPageMembersAmountByPageID']));
    return result;
  }

  sendInvitationEmail(inputData: IPageMemberInviteInput): Observable<IHTTPResult> {
    const result = this.apollo
      .mutate({
        mutation: gql`
          mutation sendInvitationEmail($inputData: PageMemberInviteInput) {
            sendInvitationEmail(inputData: $inputData) {
              status
            }
          }
        `,
        variables: {
          inputData: inputData,
        },
        refetchQueries: ['getPageMembersByPageID', 'getPageMemberDetail'],
      })
      .pipe<IHTTPResult>(map((x) => x.data['sendInvitationEmail']));
    return result;
  }

  removePageMember(id: number): Observable<IHTTPResult> {
    const result = this.apollo
      .mutate({
        mutation: gql`
          mutation removePageMember($id: Int) {
            removePageMember(id: $id) {
              status
            }
          }
        `,
        variables: {
          id,
        },
        refetchQueries: ['getPageMembersByPageID', 'getPageMemberDetail'],
      })
      .pipe<IHTTPResult>(map((x) => x.data['removePageMember']));
    return result;
  }

  revokePageMemberByEmail(email: string): Observable<IHTTPResult> {
    const result = this.apollo
      .mutate({
        mutation: gql`
          mutation revokePageMemberByEmail($email: String) {
            revokePageMemberByEmail(email: $email) {
              status
            }
          }
        `,
        variables: {
          email,
        },
        refetchQueries: ['getPageMembersByPageID', 'getPageMemberDetail'],
      })
      .pipe<IHTTPResult>(map((x) => x.data['revokePageMemberByEmail']));
    return result;
  }

  revokePageMemberByUserID(id: number): Observable<IHTTPResult> {
    const result = this.apollo
      .mutate({
        mutation: gql`
          mutation revokePageMemberByUserID($id: Int) {
            revokePageMemberByUserID(id: $id) {
              status
            }
          }
        `,
        variables: {
          id,
        },
        refetchQueries: ['getPageMembersByPageID', 'getPageMemberDetail'],
      })
      .pipe<IHTTPResult>(map((x) => x.data['revokePageMemberByUserID']));
    return result;
  }
}
