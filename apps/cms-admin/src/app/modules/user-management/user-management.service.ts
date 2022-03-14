import { Injectable, OnDestroy } from '@angular/core';
import { IHTTPResult } from '@reactor-room/model-lib';
import { Apollo } from 'apollo-angular';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';
import { getUsers, sendInvitationByEmail } from './get.user.type';
import { IUserResponseData } from '@reactor-room/cms-models-lib';
@Injectable({
  providedIn: 'root',
})
export class UserManagementService implements OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(private apollo: Apollo) {}
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  getUser(): Observable<IUserResponseData[]> {
    return this.apollo
      .watchQuery({
        query: getUsers,
      })
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        tap((data) => {}),
        map((x) => x.data['getAllUser']),
      );
  }

  sendInvitation(email: string, role: string): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: sendInvitationByEmail,
        variables: {
          input: {
            email,
            role,
          },
        },
      })
      .pipe(map((x) => x.data['sendInvitation']));
  }
}
