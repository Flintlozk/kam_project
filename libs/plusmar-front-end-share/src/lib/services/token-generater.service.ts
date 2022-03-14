import { Injectable } from '@angular/core';
import { IHTTPResult } from '@reactor-room/model-lib';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class TokenGeneratorService {
  token = '';
  constructor(private apollo: Apollo) {}

  characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  generateString(length: number): string {
    let result = ' ';
    const charactersLength = this.characters.length;
    for (let i = 0; i < length; i++) {
      result += this.characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  }

  generateToken(): string {
    if (!this.token) {
      this.token = this.generateString(8);
    }
    return this.token;
  }

  getInvitationTokenByEmail(email: string): Observable<IHTTPResult> {
    return this.apollo
      .query({
        query: gql`
          query getInvitationTokenByEmail($email: String) {
            getInvitationTokenByEmail(email: $email) {
              status
              value
            }
          }
        `,
        variables: {
          email,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(map((response) => response.data['getInvitationTokenByEmail']));
  }
}
