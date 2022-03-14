import { Injectable, OnDestroy } from '@angular/core';
import { IHTTPResult } from '@reactor-room/model-lib';
import {
  IAddShopProfile,
  ICompanyInfo,
  IGetShopProfile,
  IGetUserPhone,
  ILineResponse,
  ILineSetting,
  ILogisticTrackingDetail,
  IPageMessageTrackMode,
  IPagePrivacyPolicyOptions,
  IPages,
  IPageSettings,
  IPagesThirdPartyActive,
  IPageTermsAndConditionOptions,
  IPageWorkingHoursOptions,
  IRefreshPageThirdPartyTokenParams,
  ISettingPageMember,
  ISettingSubscriptionDetail,
  ISocialConnect,
  PageSettingType,
} from '@reactor-room/itopplus-model-lib';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class SettingsService implements OnDestroy {
  constructor(private apollo: Apollo) {}
  destroy$: Subject<boolean> = new Subject<boolean>();

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  getShopProfile(): Observable<IGetShopProfile> {
    return this.apollo
      .query({
        query: gql`
          query getShopProfile {
            getShopProfile {
              id
              firstname
              lastname
              tel
              page_name
              email
              address
              currency
              language
              fb_page_id
              shop_picture
              post_code
              amphoe
              district
              province
              country
              social_facebook
              social_line
              social_shopee
              social_lazada
            }
          }
        `,
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getShopProfile']),
      );
  }

  getCompanyInfo(): Observable<ICompanyInfo> {
    return this.apollo
      .query({
        query: gql`
          query getCompanyInfo {
            getCompanyInfo {
              company_name
              company_logo
              branch_name
              branch_id
              tax_identification_number
              tax_id
              phone_number
              email
              fax
              address
              post_code
              sub_district
              district
              province
              country
            }
          }
        `,
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getCompanyInfo']),
      );
  }

  getSubScriptionDetail(): Observable<ISettingSubscriptionDetail> {
    return this.apollo
      .query({
        query: gql`
          query getSubScriptionDetail {
            getSubScriptionDetail {
              package
              pagelimit
              pageusing
              daysRemaining
              expiredDate
            }
          }
        `,
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getSubScriptionDetail']),
      );
  }

  getPageThirdPartyInactive(): Observable<IPagesThirdPartyActive[]> {
    return this.apollo
      .query({
        query: gql`
          query getPageThirdPartyInactive {
            getPageThirdPartyInactive {
              id
              pageID
              name
              sellerID
              pageType
              active
            }
          }
        `,
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getPageThirdPartyInactive']),
      );
  }

  getSocialConnectStatus(): Observable<ISocialConnect> {
    return this.apollo
      .query({
        query: gql`
          query getSocialConnectStatus {
            getSocialConnectStatus {
              facebook {
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
              line {
                name
                picture
                id
              }
              shopee {
                id
                pageID
                sellerID
                url
                name
                accessToken
                pageType
                payload
                accessTokenExpire
                refreshToken
                refreshTokenExpire
                updatedAt
              }
              lazada {
                id
                pageID
                sellerID
                url
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
          }
        `,
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getSocialConnectStatus']),
      );
  }

  getPageMemberDetail(): Observable<ISettingPageMember> {
    return this.apollo
      .watchQuery({
        query: gql`
          query getPageMemberDetail {
            getPageMemberDetail {
              memberlimit
              memberusing
            }
          }
        `,
        fetchPolicy: 'no-cache',
      })
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getPageMemberDetail']),
      );
  }

  getLineChannelSettingByPageID(): Observable<ILineSetting> {
    return this.apollo
      .watchQuery({
        query: gql`
          query getLineChannelSettingByPageID {
            getLineChannelSettingByPageID {
              basicid
              channelid
              channelsecret
              channeltoken
              id
              uuid
            }
          }
        `,
        fetchPolicy: 'no-cache',
      })
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getLineChannelSettingByPageID']),
      );
  }

  setShopFanPage(page: IAddShopProfile, isFromWizard: boolean): Observable<IPages> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation setShopFanPage($page: AddShopProfile, $isFromWizard: Boolean) {
            setShopFanPage(page: $page, isFromWizard: $isFromWizard) {
              firstName
              lastName
              shopName
              email
              facebookid
              facebookpic
              accesstoken
              address
              country
              location {
                amphoe
                district
                post_code
                province
              }
              currency {
                currencyImgUrl
                currencyTitle
              }
              language {
                languageImgUrl
                languageTitle
              }
            }
          }
        `,
        variables: {
          page: page,
          isFromWizard: isFromWizard,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['setShopFanPage']),
      );
  }
  getLogisticTrackingTypeByUuid(uuid: string): Observable<ILogisticTrackingDetail> {
    return this.apollo
      .query({
        query: gql`
          query getLogisticTrackingTypeByUuid($uuid: String) {
            getLogisticTrackingTypeByUuid(uuid: $uuid) {
              delivery_type
              tracking_type
              cod_status
            }
          }
        `,
        variables: {
          uuid,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((response) => response.data['getLogisticTrackingTypeByUuid']),
      );
  }
  getPhoneFromUser(): Observable<IGetUserPhone> {
    return this.apollo
      .query({
        query: gql`
          query getPhoneFromUser {
            getPhoneFromUser {
              tel
            }
          }
        `,
      })
      .pipe(
        takeUntil(this.destroy$),
        map((response) => response.data['getPhoneFromUser']),
      );
  }

  verifyChannelAccesstoken(channeltoken: string, channelid: number): Observable<ILineSetting> {
    return this.apollo
      .query({
        query: gql`
          query verifyChannelAccesstoken($channeltoken: String, $channelid: Int) {
            verifyChannelAccesstoken(channeltoken: $channeltoken, channelid: $channelid) {
              premiumid
              userid
              pictureurl
              displayname
            }
          }
        `,
        variables: {
          channeltoken,
          channelid,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((response) => response.data['verifyChannelAccesstoken']),
      );
  }

  setLineChannelDetail(lineinfor: ILineSetting): Observable<ILineResponse> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation setLineChannelDetail($lineinfor: LineSetting) {
            setLineChannelDetail(lineinfor: $lineinfor) {
              id
              name
              picture
            }
          }
        `,
        variables: {
          lineinfor,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['setLineChannelDetail']),
      );
  }

  saveCompanyInfo(info: ICompanyInfo): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation saveCompanyInfo($info: CompanyInfoInput) {
            saveCompanyInfo(info: $info) {
              status
              value
            }
          }
        `,
        variables: {
          info,
        },
        context: {
          useMultipart: true,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['saveCompanyInfo']),
      );
  }

  updateCompanyInfo(info: ICompanyInfo): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation updateCompanyInfo($info: CompanyInfoInput) {
            updateCompanyInfo(info: $info) {
              status
              value
            }
          }
        `,
        variables: {
          info,
        },
        context: {
          useMultipart: true,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updateCompanyInfo']),
      );
  }

  refreshPageThirdPartyToken(refreshPageThirdPartyTokenParams: IRefreshPageThirdPartyTokenParams): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation refreshPageThirdPartyToken($pageType: String, $tokenType: String) {
            refreshPageThirdPartyToken(pageType: $pageType, tokenType: $tokenType) {
              value
              status
            }
          }
        `,
        variables: {
          ...refreshPageThirdPartyTokenParams,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['refreshPageThirdPartyToken']),
      );
  }

  togglePageSetting(status: boolean, type: PageSettingType): Observable<boolean> {
    return this.apollo
      .query({
        query: gql`
          query togglePageSetting($status: Boolean, $type: PageSettingType) {
            togglePageSetting(status: $status, type: $type)
          }
        `,
        fetchPolicy: 'no-cache',
        variables: {
          status,
          type,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['togglePageSetting']),
      );
  }

  getPageSettings(): Observable<IPageSettings[]> {
    return this.apollo
      .query({
        query: gql`
          query getPageSettings {
            getPageSettings {
              id
              page_id
              setting_type
              status
              created_at
              updated_at
            }
          }
        `,
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getPageSettings']),
      );
  }
  getPageSetting(type: PageSettingType): Observable<IPageSettings> {
    const times = `
    {
      isActive
      allTimes
      times {
        openTime
        closeTime
      }
    }
    `;
    return this.apollo
      .query({
        query: gql`
          query getPageSetting($type: PageSettingType) {
            getPageSetting(type: $type) {
              ... on PageCloseCustomerSetting {
                id
                page_id
                setting_type
                status
                created_at
                updated_at
                options {
                  url
                }
              }
              ... on PageQuickpayWebhook {
                id
                page_id
                setting_type
                status
                created_at
                updated_at
                options {
                  url
                }
              }
              ... on PageMessageTrackSetting {
                id
                page_id
                setting_type
                status
                created_at
                updated_at
                options {
                  trackMode
                }
              }
              ... on PageCustomerSlaTimeSetting {
                id
                page_id
                setting_type
                status
                created_at
                updated_at
                options {
                  alertHour
                  alertMinute
                  hour
                  minute
                }
              }
              ... on PageTermsAndConditionSetting {
                id
                page_id
                setting_type
                status
                created_at
                updated_at
                options {
                  textTH
                  textENG
                }
              }
              ... on PageLogisticSystemSetting {
                id
                page_id
                setting_type
                status
                created_at
                updated_at
                options {
                  pricingTable{
                    type
                    isActive
                    provider
                  }
                  flatRate{
                    type
                    isActive 
                    deliveryFee
                  }
                  fixedRate{
                    type
                    isActive
                    useMin
                  amount
                  fallbackType
                  }
                }
              }
              ... on PageWorkingHoursSetting {
                id
                page_id
                setting_type
                status
                created_at
                updated_at
                options {
                  offTime {
                    isActive
                    message
                    attachment
                  }
                  notifyList{
                    isActive
                    emails {
                      email
                    }
                  }
                  additional{
                    isActive
                    time
                  }
                  sunday ${times}
                  monday ${times}
                  tuesday ${times}
                  wednesday ${times}
                  thursday ${times}
                  friday ${times}
                  saturday ${times}
                }
              }
            }
          }
        `,
        fetchPolicy: 'no-cache',
        variables: { type },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getPageSetting']),
      );
  }
  getPageDefaultSetting(type: PageSettingType): Observable<string> {
    return this.apollo
      .query({
        query: gql`
          query getPageDefaultSetting($type: PageSettingType) {
            getPageDefaultSetting(type: $type)
          }
        `,
        fetchPolicy: 'no-cache',
        variables: { type },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getPageDefaultSetting']),
      );
  }

  saveWebhookURL(url: string, type: PageSettingType): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation saveWebhookURL($url: String, $type: PageSettingType) {
            saveWebhookURL(url: $url, type: $type)
          }
        `,
        variables: {
          url,
          type,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['saveWebhookURL']),
      );
  }
  setTermsAndCondition(input: IPageTermsAndConditionOptions): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation setTermsAndCondition($input: InputSetPDPA) {
            setTermsAndCondition(input: $input)
          }
        `,
        variables: {
          input,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['setTermsAndCondition']),
      );
  }
  setPrivacyPolicy(input: IPagePrivacyPolicyOptions): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation setPrivacyPolicy($input: InputSetPDPA) {
            setPrivacyPolicy(input: $input)
          }
        `,
        variables: {
          input,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['setPrivacyPolicy']),
      );
  }

  setWorkingHour(config: IPageWorkingHoursOptions): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation setWorkingHourSetting($config: PageWorkingHoursOptionsInput) {
            setWorkingHourSetting(config: $config)
          }
        `,
        variables: {
          config,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['setWorkingHourSetting']),
      );
  }

  setMessageTrackMode(config: IPageMessageTrackMode): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation setMessageTrackMode($config: PageMessageTrackModeOptionsInput) {
            setMessageTrackMode(config: $config)
          }
        `,
        variables: {
          config,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['setMessageTrackMode']),
      );
  }
}
