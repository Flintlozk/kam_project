import { Injectable } from '@angular/core';
import { IHTTPResult } from '@reactor-room/model-lib';
import { IAssignUsersTagInput, IUserAndTagsList, IUserList } from '@reactor-room/itopplus-model-lib';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'platform',
})
export class UserTagService {
  constructor(private apollo: Apollo) {}

  getUserList(): Observable<IUserList[]> {
    return this.apollo
      .query({
        query: gql`
          query getUserList {
            getUserList {
              userID
              userName
              userImage
              userRole
              userAlias
              userEmail
              userNotifyEmail
            }
          }
        `,
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['getUserList']));
  }
  getUsersAndTags(tagID: number): Observable<IUserAndTagsList[]> {
    return this.apollo
      .query({
        query: gql`
          query getUsersAndTags($tagID: Int) {
            getUsersAndTags(tagID: $tagID) {
              userID
              userName
              userAlias
              userImage
              isActive
            }
          }
        `,
        fetchPolicy: 'no-cache',
        variables: {
          tagID,
        },
      })
      .pipe(map((response) => response.data['getUsersAndTags']));
  }
  assignUsersTag(assign: IAssignUsersTagInput[]): Observable<IUserAndTagsList[]> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation assignUsersTag($assign: [AssignUsersTagInput]) {
            assignUsersTag(assign: $assign) {
              status
              value
            }
          }
        `,
        variables: {
          assign,
        },
      })
      .pipe(map((response) => response.data['assignUsersTag']));
  }
  assignUserToAudience(audienceID: number, userID: number): Observable<IHTTPResult> {
    return this.apollo
      .mutate<IHTTPResult>({
        mutation: gql`
          mutation assignUserToAudience($audienceID: Int, $userID: Int) {
            assignUserToAudience(audienceID: $audienceID, userID: $userID) {
              status
              value
            }
          }
        `,
        variables: {
          audienceID,
          userID,
        },
      })
      .pipe(map((response) => response.data['assignUserToAudience']));
  }
}
