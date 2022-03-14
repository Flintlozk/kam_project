import { Injectable, OnDestroy } from '@angular/core';
import {
  IWebsiteConfigGeneral,
  IWebsiteConfigGeneralLanguage,
  IWebsiteConfigTheme,
  IWebsiteConfigSEO,
  IWebsiteConfigMeta,
  IWebsiteConfigCSS,
  IWebsiteConfigDataPrivacy,
} from '@reactor-room/cms-models-lib';
import { IHTTPResult } from '@reactor-room/model-lib';
import { Apollo } from 'apollo-angular';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import {
  GET_CONFIG_GENERAL,
  GET_CONFIG_GENERAL_LANGUAGE,
  GET_CONFIG_SHOTCUTS,
  GET_CONFIG_STYLE,
  GET_CONFIG_THEME,
  SAVE_CONFIG_GENERAL,
  SAVE_CONFIG_SHORTCUTS,
  SAVE_CONFIG_STYLE,
  SAVE_CONFIG_THEME,
  SAVE_CONFIG_SEO,
  GET_CONFIG_SEO,
  SAVE_CONFIG_META,
  GET_CONFIG_META,
  SAVE_CONFIG_CSS,
  GET_CONFIG_CSS,
  GET_CONFIG_DATA_PRIVACY,
  SAVE_CONFIG_DATA_PRIVACY,
} from './query/setting-website.query';

@Injectable({
  providedIn: 'root',
})
export class SettingWebsiteService implements OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  $configStyle = new ReplaySubject<string>();

  constructor(private apollo: Apollo) {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  saveConfigTheme(configTheme: IWebsiteConfigTheme): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: SAVE_CONFIG_THEME,
        fetchPolicy: 'no-cache',
        variables: { configTheme },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['saveConfigTheme']),
      );
  }

  saveConfigShortcuts(configShortcuts: string[]): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: SAVE_CONFIG_SHORTCUTS,
        fetchPolicy: 'no-cache',
        variables: { configShortcuts },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['saveConfigShortcuts']),
      );
  }

  saveConfigStyle(style: string): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: SAVE_CONFIG_STYLE,
        fetchPolicy: 'no-cache',
        variables: { style },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['saveConfigStyle']),
      );
  }

  saveConfigGeneral(configGeneral: IWebsiteConfigGeneral): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: SAVE_CONFIG_GENERAL,
        fetchPolicy: 'no-cache',
        variables: { configGeneral },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['saveConfigGeneral']),
      );
  }
  //start add
  saveConfigSEO(configSEO: IWebsiteConfigSEO): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: SAVE_CONFIG_SEO,
        fetchPolicy: 'no-cache',
        variables: { configSEO },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['saveConfigSEO']),
      );
  }

  saveConfigDataPrivacy(configDataPrivacy: IWebsiteConfigDataPrivacy): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: SAVE_CONFIG_DATA_PRIVACY,
        fetchPolicy: 'no-cache',
        variables: { configDataPrivacy },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['saveConfigDataPrivacy']),
      );
  }

  saveConfigCSS(configCSS: IWebsiteConfigCSS): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: SAVE_CONFIG_CSS,
        fetchPolicy: 'no-cache',
        variables: { configCSS },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['saveConfigCSS']),
      );
  }
  //getTermCondtions
  getConfigDataPrivacy(): Observable<IWebsiteConfigDataPrivacy> {
    return this.apollo
      .query({
        query: GET_CONFIG_DATA_PRIVACY,
        fetchPolicy: 'no-cache',
        variables: {},
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getConfigDataPrivacy']),
      );
  }

  getConfigSEO(): Observable<IWebsiteConfigSEO> {
    return this.apollo
      .query({
        query: GET_CONFIG_SEO,
        fetchPolicy: 'no-cache',
        variables: {},
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getConfigSEO']),
      );
  }

  getConfigCSS(): Observable<IWebsiteConfigCSS> {
    return this.apollo
      .query({
        query: GET_CONFIG_CSS,
        fetchPolicy: 'no-cache',
        variables: {},
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getConfigCSS']),
      );
  }

  saveConfigMeta(configMeta: IWebsiteConfigMeta): Observable<IHTTPResult> {
    return this.apollo
      .mutate({
        mutation: SAVE_CONFIG_META,
        fetchPolicy: 'no-cache',
        variables: { configMeta },
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['saveConfigMeta']),
      );
  }
  getConfigMeta(): Observable<IWebsiteConfigMeta> {
    return this.apollo
      .query({
        query: GET_CONFIG_META,
        fetchPolicy: 'no-cache',
        variables: {},
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getConfigMeta']),
      );
  }
  // GET_CONFIG_META
  //end add

  getConfigTheme(): Observable<IWebsiteConfigTheme> {
    return this.apollo
      .query({
        query: GET_CONFIG_THEME,
        fetchPolicy: 'no-cache',
        variables: {},
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getConfigTheme']),
      );
  }

  getConfigStyle(): Observable<string> {
    return this.apollo
      .query({
        query: GET_CONFIG_STYLE,
        fetchPolicy: 'no-cache',
        variables: {},
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getConfigStyle']),
      );
  }

  getConfigShortcuts(): Observable<string[]> {
    return this.apollo
      .query({
        query: GET_CONFIG_SHOTCUTS,
        fetchPolicy: 'no-cache',
        variables: {},
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getConfigShortcuts']),
      );
  }

  getConfigGeneral(): Observable<IWebsiteConfigGeneral> {
    return this.apollo
      .query({
        query: GET_CONFIG_GENERAL,
        fetchPolicy: 'no-cache',
        variables: {},
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getConfigGeneral']),
      );
  }

  getConfigGeneralLanguage(): Observable<IWebsiteConfigGeneralLanguage> {
    return this.apollo
      .query({
        query: GET_CONFIG_GENERAL_LANGUAGE,
        fetchPolicy: 'no-cache',
        variables: {},
      })
      .pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getConfigGeneralLanguage']),
      );
  }
}
