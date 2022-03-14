import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Injectable, OnDestroy } from '@angular/core';

import { Observable, Subject, ReplaySubject, BehaviorSubject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import {
  IDeltaRenderingComponentData,
  IPageComponent,
  IRenderingComponentData,
  IThemeComponent,
  IThemeSharingComponentConfig,
  IThemeRendering,
  IThemeRenderingSettingColors,
  IThemeRenderingSettingFont,
  IThemeDevice,
  IWebPageThemelayoutIndex,
  IWebPageComponentDelta,
} from '@reactor-room/cms-models-lib';
import { IHTTPResult } from '@reactor-room/model-lib';
import { GET_COMPONENT, GET_LANDING_COMPONENT, GET_THEME_COMPONENTS } from './cms-query/website.query';

@Injectable({
  providedIn: 'root',
})
export class WebsiteService implements OnDestroy {
  constructor(private apollo: Apollo) {}
  destroy$: Subject<boolean> = new Subject<boolean>();
  $pageTheme = new ReplaySubject<IThemeRendering>();
  $pageComponent = new ReplaySubject<IPageComponent>();
  $themeComponents = new ReplaySubject<IRenderingComponentData[]>();
  $sharingThemeConfig = new ReplaySubject<IThemeSharingComponentConfig>();
  $angularHTML = new Subject<{ angularHtmlPageComponent: string; angularHtmlThemeComponent: string }>();
  $triggerMenuHTML = new Subject();
  $triggerMenuCssJs = new Subject();
  $themeLayoutIndex = new BehaviorSubject<number>(0);
  getthemeLayoutIndex = this.$themeLayoutIndex.asObservable();
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  getTheme(): Observable<IThemeRendering> {
    //TODO: Heng Change Query -> Chane GQL Respone Data (data structure change)
    return this.apollo
      .query({
        query: gql`
          query getTheme {
            getTheme {
              name
              devices {
                minwidth
                icon
                default
                baseFontSize
              }
              settings {
                font {
                  type
                  size
                  familyCode
                  unit
                  style
                  lineHeight
                  letterSpacing
                }
                color {
                  type
                  dark {
                    color
                    bgColor
                  }
                  light {
                    color
                    bgColor
                  }
                }
                integration {
                  fontAwesome
                  googleFont
                }
              }
              style {
                url
              }
              html {
                name
                html
                thumbnail {
                  path
                }
              }
              themeLayoutLength
            }
          }
        `,
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getTheme']),
      );
  }
  getSharingThemeConfigAndSetThemeSharing(): Observable<IThemeSharingComponentConfig> {
    return this.apollo
      .query({
        query: gql`
          query getSharingThemeConfigAndSetThemeSharing {
            getSharingThemeConfigAndSetThemeSharing {
              devices {
                minwidth
                icon
                default
                baseFontSize
              }
              font {
                type
                size
                familyCode
                unit
                style
                lineHeight
                letterSpacing
              }
              color {
                type
                dark {
                  color
                  bgColor
                  opacity
                  bgOpacity
                }
                light {
                  color
                  bgColor
                  opacity
                  bgOpacity
                }
              }
            }
          }
        `,
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getSharingThemeConfigAndSetThemeSharing']),
      );
  }
  getLandingComponent(webPageID: string, previousWebPageID: string, componentId: string, contentId: string): Observable<IPageComponent> {
    return this.apollo
      .query({
        query: GET_LANDING_COMPONENT,
        fetchPolicy: 'no-cache',
        variables: { webPageID, previousWebPageID, componentId, contentId },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getLandingComponent']),
      );
  }
  getComponent(webPageID: string): Observable<IPageComponent> {
    return this.apollo
      .query({
        query: GET_COMPONENT,
        fetchPolicy: 'no-cache',
        variables: { webPageID },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getComponent']),
      );
  }
  getThemeComponents(webPageThemelayoutIndex: IWebPageThemelayoutIndex): Observable<IThemeComponent> {
    return this.apollo
      .query({
        query: GET_THEME_COMPONENTS,
        fetchPolicy: 'no-cache',
        variables: { webPageThemelayoutIndex },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getThemeComponents']),
      );
  }
  getUpdatedSiteCSS(): Observable<IHTTPResult> {
    return this.apollo
      .query({
        query: gql`
          query getUpdatedSiteCSS {
            getUpdatedSiteCSS {
              status
              value
            }
          }
        `,
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getUpdatedSiteCSS']),
      );
  }
  updatePageComponentByWebPageID(deltaPageComponent: IDeltaRenderingComponentData): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation updatePageComponentByWebPageID($deltaPageComponent: InputDeltaPageComponent) {
            updatePageComponentByWebPageID(deltaPageComponent: $deltaPageComponent) {
              status
              value
            }
          }
        `,
        fetchPolicy: 'no-cache',
        variables: {
          deltaPageComponent: deltaPageComponent,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updatePageComponentByWebPageID']),
      );
  }
  updateSharingThemeComponent(deltaPageComponent: IDeltaRenderingComponentData): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation updateSharingThemeComponent($deltaPageComponent: InputDeltaPageComponent) {
            updateSharingThemeComponent(deltaPageComponent: $deltaPageComponent) {
              status
              value
            }
          }
        `,
        fetchPolicy: 'no-cache',
        variables: {
          deltaPageComponent: deltaPageComponent,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updateSharingThemeComponent']),
      );
  }

  updateSharingThemeConfigColor(color: IThemeRenderingSettingColors[]): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation updateSharingThemeConfigColor($color: [ThemeSettingColorInput]) {
            updateSharingThemeConfigColor(color: $color) {
              status
              value
            }
          }
        `,
        fetchPolicy: 'no-cache',
        variables: {
          color: color,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updateSharingThemeConfigColor']),
      );
  }

  updateSharingThemeConfigFont(font: IThemeRenderingSettingFont[]): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation updateSharingThemeConfigFont($font: [ThemeSettingFontInput]) {
            updateSharingThemeConfigFont(font: $font) {
              status
              value
            }
          }
        `,
        fetchPolicy: 'no-cache',
        variables: {
          font: font,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updateSharingThemeConfigFont']),
      );
  }

  updateSharingThemeConfigDevices(devices: IThemeDevice[]): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation updateSharingThemeConfigDevices($devices: [ThemeDevicesInput]) {
            updateSharingThemeConfigDevices(devices: $devices) {
              status
              value
            }
          }
        `,
        fetchPolicy: 'no-cache',
        variables: {
          devices: devices,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updateSharingThemeConfigDevices']),
      );
  }
  publishAllPages(): Observable<IHTTPResult> {
    return this.apollo
      .query({
        query: gql`
          query publishAllPages {
            publishAllPages {
              status
              value
            }
          }
        `,
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['publishAllPages']),
      );
  }
  updateWebPageAllComponents(webPageDelta: IWebPageComponentDelta): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation updateWebPageAllComponents($webPageDelta: InputWebPageDelta) {
            updateWebPageAllComponents(webPageDelta: $webPageDelta) {
              status
              value
            }
          }
        `,
        fetchPolicy: 'no-cache',
        variables: {
          webPageDelta: webPageDelta,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updateWebPageAllComponents']),
      );
  }

  updateComponentLandingPageOption(landing: string, webPageID: string, componentId: string): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation updateComponentLandingPageOption($landing: String, $webPageID: String, $componentId: String) {
            updateComponentLandingPageOption(landing: $landing, webPageID: $webPageID, componentId: $componentId) {
              status
              value
            }
          }
        `,
        fetchPolicy: 'no-cache',
        variables: {
          landing,
          webPageID,
          componentId,
        },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['updateComponentLandingPageOption']),
      );
  }
  mockWebPageAndPageComponentForCmsAdmin(): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation mockWebPageAndPageComponentForCmsAdmin {
            mockWebPageAndPageComponentForCmsAdmin {
              status
              value
            }
          }
        `,
        fetchPolicy: 'no-cache',
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['mockWebPageAndPageComponentForCmsAdmin']),
      );
  }
}
