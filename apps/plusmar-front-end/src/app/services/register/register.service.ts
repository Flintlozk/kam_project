import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Injectable } from '@angular/core';
import { IHTTPResult, IUserRegistrationModel } from '@reactor-room/model-lib';
import { ISIDAndEmailInput, IUserCredential } from '@reactor-room/itopplus-model-lib';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private apollo: Apollo) {}

  getUserfromSIDAndEmail(inputData: ISIDAndEmailInput): Observable<IUserCredential> {
    return this.apollo
      .query({
        query: gql`
          query getUserfromSIDAndEmail($inputData: SIDAndEmailInput) {
            getUserfromSIDAndEmail(inputData: $inputData) {
              id
              name
              email
              tel
            }
          }
        `,
        variables: {
          inputData,
        },
      })
      .pipe(map((x) => x.data['getUserfromSIDAndEmail']));
  }

  sendOTP(phoneNumber: string): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation sendOTP($phoneNumber: String) {
            sendOTP(phoneNumber: $phoneNumber) {
              status
              value
            }
          }
        `,
        variables: {
          phoneNumber,
        },
      })
      .pipe<IHTTPResult>(map((x) => x.data['sendOTP']));
  }

  validateOTP(phoneNumber: string, pin: string): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation validateOTP($phoneNumber: String, $pin: String) {
            validateOTP(phoneNumber: $phoneNumber, pin: $pin) {
              status
              value
            }
          }
        `,
        variables: {
          pin,
          phoneNumber,
        },
      })
      .pipe<IHTTPResult>(map((x) => x.data['validateOTP']));
  }
}
