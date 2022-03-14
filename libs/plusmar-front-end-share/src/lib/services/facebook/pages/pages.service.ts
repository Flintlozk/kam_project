import { EventEmitter, Injectable, Input, OnDestroy } from '@angular/core';
import { IFacebookCredential, IHTTPResult, ITextString } from '@reactor-room/model-lib';
import {
  EnumWizardStepType,
  IFacebookPageResponse,
  IFacebookPageWithBindedPageStatus,
  IMessageSetting,
  IPageAdvancedSettings,
  IPageFlatStatusWithFee,
  IPages,
  IPagesContext,
  IPagesThirdParty,
  IQuilDescriptionInput,
  SocialTypes,
} from '@reactor-room/itopplus-model-lib';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { CHANGING_PAGE, CHECK_PAGE_FACEBOOK_CONNECTED } from './pages.query';

@Injectable({
  providedIn: 'root',
})
export class PagesService implements OnDestroy {
  @Input() selectPage: EventEmitter<IFacebookPageResponse> = new EventEmitter();
  destroy$: Subject<boolean> = new Subject<boolean>();
  updateContext: Subject<boolean> = new Subject<boolean>();
  currentPage: ReplaySubject<IPagesContext> = new ReplaySubject<IPagesContext>(null);
  currentPage$: Observable<IPagesContext> = this.currentPage.asObservable();
  $facebookResponse: ReplaySubject<IFacebookPageResponse> = new ReplaySubject<IFacebookPageResponse>();
  constructor(private apollo: Apollo) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  createPage(): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation createPage {
            createPage {
              status
            }
          }
        `,
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['createPage']),
      );
  }

  updateFacebookPageToken(): Observable<IHTTPResult> {
    return this.apollo
      .query({
        query: gql`
          query updateFacebookPageToken {
            updateFacebookPageToken {
              status
              value
            }
          }
        `,
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updateFacebookPageToken']),
      );
  }
  savePageMessage(message: IMessageSetting): Observable<IPages> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation savePageMessage($message: MessageSettingInput) {
            savePageMessage(message: $message) {
              id
            }
          }
        `,
        variables: {
          message: message,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['savePageMessage']),
      );
  }
  saveCartMessage(message: IMessageSetting): Observable<IPages> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation saveCartMessage($message: MessageSettingInput) {
            saveCartMessage(message: $message) {
              id
            }
          }
        `,
        variables: {
          message: message,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['saveCartMessage']),
      );
  }
  saveTermsAndCondition(message: IQuilDescriptionInput): Observable<IPages> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation saveTermsAndCondition($message: QuilDesctiptionInput) {
            saveTermsAndCondition(message: $message) {
              id
            }
          }
        `,
        variables: {
          message: message,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updatePageAdvancedSettings']),
      );
  }
  updatePageAdvancedSettings(settings: IPageAdvancedSettings): Observable<IPages> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation updatePageAdvancedSettings($settings: PageSettingsInput) {
            updatePageAdvancedSettings(settings: $settings) {
              id
            }
          }
        `,
        variables: {
          settings: settings,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updatePageAdvancedSettings']),
      );
  }

  updateFacebookPageFromWizardStep(pageInput: IFacebookPageResponse): Observable<IPages> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation updateFacebookPageFromWizardStep($pageInput: FacebookPageDataInput) {
            updateFacebookPageFromWizardStep(pageInput: $pageInput) {
              status
            }
          }
        `,
        variables: {
          pageInput: pageInput,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updateFacebookPageFromWizardStep']),
      );
  }

  updatePageLogisticFromWizardStep(flatInput: IPageFlatStatusWithFee): Observable<IPages> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation updatePageLogisticFromWizardStep($flatInput: PageFlatStatusWithFeeInput) {
            updatePageLogisticFromWizardStep(flatInput: $flatInput) {
              status
            }
          }
        `,
        variables: {
          flatInput: flatInput,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updatePageLogisticFromWizardStep']),
      );
  }

  updatePageWizardStepToSuccess(currentStep: EnumWizardStepType): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation updatePageWizardStepToSuccess($currentStep: EnumWizardStepType) {
            updatePageWizardStepToSuccess(currentStep: $currentStep) {
              status
            }
          }
        `,
        variables: {
          currentStep: currentStep,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updatePageWizardStepToSuccess']),
      );
  }

  deletePage(): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation deletePage {
            deletePage {
              status
            }
          }
        `,
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['deletePage']),
      );
  }

  getPageMessage(type: string): Observable<IMessageSetting> {
    return this.apollo
      .query({
        query: gql`
          query getPageMessage($type: String) {
            getPageMessage(type: $type) {
              message1
              message2
              message3
              message4
              message5
              message6
              message7
              message8
              message9
              message10
              message11
              message12
              message13
              message14
              message15
              message16
              message17
              message18
              message19
              terms_condition
            }
          }
        `,
        variables: {
          type,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getPageMessage']),
      );
  }

  getPageByID(): Observable<IPages> {
    return this.apollo
      .query({
        query: gql`
          query getPageByID {
            getPageByID {
              id
              fb_page_id
              option {
                advanced_settings {
                  auto_reply
                  direct_message {
                    type
                    class
                    label
                    title
                    image
                    defaultLabel
                    defaultTitle
                  }
                }
              }
              wizard_step
            }
          }
        `,
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getPageByID']),
      );
  }
  getUnfinishPageSetting(): Observable<IPages> {
    return this.apollo
      .query({
        query: gql`
          query getUnfinishPageSetting {
            getUnfinishPageSetting {
              id
              fb_page_id
              option {
                advanced_settings {
                  auto_reply
                  direct_message {
                    type
                    class
                    label
                    title
                    image
                    defaultLabel
                    defaultTitle
                  }
                }
              }
              page_app_scope
              wizard_step
            }
          }
        `,
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getUnfinishPageSetting']),
      );
  }

  getPages(): Observable<IPages[]> {
    return this.apollo
      .watchQuery({
        query: gql`
          query getPages {
            getPages {
              id
              page_name
              page_username
              created_at
              updated_at
              fb_page_id
              shop_picture
              option {
                id
                name
                picture
                category
                access_token
              }
            }
          }
        `,
        fetchPolicy: 'no-cache',
      })
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getPages']),
      );
  }

  changingPage(pageIndex: number): Observable<IPages[]> {
    return this.apollo
      .query({
        query: CHANGING_PAGE,
        variables: {
          pageIndex,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['changingPage']),
      );
  }

  checkPageFacebookConnected(pageIndex: number): Observable<{ isConnected: boolean }> {
    return this.apollo
      .query({
        query: CHECK_PAGE_FACEBOOK_CONNECTED,
        variables: {
          pageIndex,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['checkPageFacebookConnected']),
      );
  }

  getPagesFromFacebook(): Observable<IFacebookPageResponse[]> {
    return this.apollo
      .query({
        query: gql`
          query getPagesFromFacebook {
            getPagesFromFacebook {
              id
              name
              tasks
              category
              access_token
              picture
              category_list {
                id
                name
              }
            }
          }
        `,
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getPagesFromFacebook']),
      );
  }

  checkMaxPages(): Observable<boolean> {
    return this.apollo
      .query({
        query: gql`
          query checkMaxPages {
            checkMaxPages
          }
        `,
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['checkMaxPages']),
      );
  }

  getPageFromFacebookByPageID(pageID: number): Observable<IFacebookPageResponse> {
    return this.apollo
      .query({
        query: gql`
          query getPageFromFacebookByPageId($pageID: Int) {
            getPageFromFacebookByPageId(pageID: $pageID) {
              id
              name
              tasks
              category
              access_token
              picture
              category_list {
                id
                name
              }
            }
          }
        `,
        variables: {
          pageID,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getPageFromFacebookByPageId']),
      );
  }

  getPageFromFacebookByCurrentPageID(): Observable<IFacebookPageResponse> {
    return this.apollo
      .query({
        query: gql`
          query getPageFromFacebookByCurrentPageID {
            getPageFromFacebookByCurrentPageID {
              id
              name
              tasks
              category
              access_token
              picture
              category_list {
                id
                name
              }
            }
          }
        `,
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getPageFromFacebookByCurrentPageID']),
      );
  }

  getPageFromFacebookByFbPageID(fbPageID: string): Observable<IFacebookPageResponse> {
    return this.apollo
      .query({
        query: gql`
          query getPageFromFacebookByFbPageID($fbPageID: String) {
            getPageFromFacebookByFbPageID(fbPageID: $fbPageID) {
              id
              name
              username
              tasks
              category
              access_token
              picture
              category_list {
                id
                name
              }
            }
          }
        `,
        variables: {
          fbPageID,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getPageFromFacebookByFbPageID']),
      );
  }
  getBindedPages(fbPages: IFacebookPageResponse[]): Observable<IFacebookPageWithBindedPageStatus[]> {
    return this.apollo
      .query({
        query: gql`
          query getBindedPages($fbPages: [FacebookPageDataInput]) {
            getBindedPages(fbPages: $fbPages) {
              facebook_page {
                id
                name
                tasks
                category
                access_token
                picture
                category_list {
                  id
                  name
                }
              }
              is_binded
              email
            }
          }
        `,
        variables: {
          fbPages,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getBindedPages']),
      );
  }

  getPageFromFacebookCredentailAndPageID(credential: IFacebookCredential, pageID: number): any {
    return this.apollo
      .query({
        query: gql`
          query getPageFromFacebookCredentailAndPageID($credential: FacebookCredentialInput, $pageID: Int) {
            getPageFromFacebookCredentailAndPageID(credential: $credential, pageID: $pageID) {
              id
              name
              tasks
              category
              access_token
              picture
              category_list {
                id
                name
              }
            }
          }
        `,
        variables: {
          credential,
          pageID,
        },
      })
      .pipe(map((x) => x.data['getPageFromFacebookCredentailAndPageID']));
  }
  getPictureFromFacebookFanpageByFacebookID(): Observable<string> {
    return this.apollo
      .query({
        query: gql`
          query getPictureFromFacebookFanpageByFacebookID {
            getPictureFromFacebookFanpageByFacebookID
          }
        `,
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getPictureFromFacebookFanpageByFacebookID']),
      );
  }

  getPictureFromFacebookFanpageByFacebookID1(): Observable<string> {
    return this.apollo
      .query({
        query: gql`
          query getPictureFromFacebookFanpageByFacebookID {
            getPictureFromFacebookFanpageByFacebookID
          }
        `,
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getPictureFromFacebookFanpageByFacebookID']),
      );
  }

  getPageThirdPartyByPageType(pageType: SocialTypes): Observable<IPagesThirdParty> {
    return this.apollo
      .query({
        query: gql`
          query getPageThirdPartyByPageType($pageType: String) {
            getPageThirdPartyByPageType(pageType: $pageType) {
              id
              pageID
              sellerID
              accessToken
              pageType
              payload
            }
          }
        `,
        variables: {
          pageType,
        },
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getPageThirdPartyByPageType']),
      );
  }

  getShopeeConnectURL(): Observable<ITextString> {
    return this.apollo
      .query({
        query: gql`
          query getShopeeConnectURL {
            getShopeeConnectURL {
              text
            }
          }
        `,
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getShopeeConnectURL']),
      );
  }

  getLazadaConnectURL(): Observable<ITextString> {
    return this.apollo
      .query({
        query: gql`
          query getLazadaConnectURL {
            getLazadaConnectURL {
              text
            }
          }
        `,
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getLazadaConnectURL']),
      );
  }

  getThirdPartyPages(): Observable<IPagesThirdParty[]> {
    return this.apollo
      .query({
        query: gql`
          query getThirdPartyPages {
            getThirdPartyPages {
              id
              pageID
              sellerID
              name
              accessToken
              pageType
              payload
              accessTokenExpire
              refreshToken
              refreshTokenExpire
              updatedAt
            }
          }
        `,
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getThirdPartyPages']),
      );
  }

  onPageChangingSubscription(): Observable<IHTTPResult> {
    return this.apollo
      .subscribe({
        query: gql`
          subscription onPageChangingSubscription {
            onPageChangingSubscription {
              status
              value
            }
          }
        `,
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => {
          return x.data['onPageChangingSubscription'];
        }),
      );
  }

  triggerPageChanging(isToCreatePage: boolean): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation triggerPageChanging($isToCreatePage: Boolean) {
            triggerPageChanging(isToCreatePage: $isToCreatePage) {
              status
            }
          }
        `,
        variables: {
          isToCreatePage,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['triggerPageChanging']),
      );
  }
}
