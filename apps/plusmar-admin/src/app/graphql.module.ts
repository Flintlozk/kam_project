import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { getCookie } from '@reactor-room/itopplus-front-end-helpers';
import { EnumAuthScope } from '@reactor-room/itopplus-model-lib';
import { environment } from '../environments/environment';

import { OperationDefinitionNode } from 'graphql';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApolloLink, from, InMemoryCache, split } from '@apollo/client/core';
import { WebSocketLink } from '@apollo/client/link/ws';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { extractFiles } from 'extract-files';

const { gqlUrl: uri } = environment;
export interface InterceptHeaders {
  Authorization: string;
  access_token?: string;
}

export interface ApolloInstance {
  link: ApolloLink;
  cache: InMemoryCache;
  fetchOptions: { credentials: string };
  defaultOptions: {
    watchQuery: {
      errorPolicy: string;
    };
  };
  resolvers: { [key: string]: string };
}

export function createApollo(httpLink: HttpLink): ApolloInstance {
  const basic = setContext(() => {
    return {
      headers: {
        'app-module': EnumAuthScope.ADMIN,
        Accept: 'charset=utf-8',
      },
    };
  });

  const headerFn = () => {
    const header = {} as InterceptHeaders;
    const accessToken = getCookie('access_token');

    if (accessToken !== null) header.access_token = accessToken || '';
    return header;
  };
  const auth = setContext((operation, context) => {
    const header = headerFn();
    return {
      headers: {
        'app-module': EnumAuthScope.ADMIN,
        ...header,
      },
    };
  });

  const http = httpLink.create({ uri, withCredentials: true, extractFiles });

  return {
    link: from([basic, auth, http]),
    cache: new InMemoryCache({ addTypename: false }),
    fetchOptions: {
      credentials: 'include',
    },
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all',
      },
    },
    resolvers: {},
  };
}

@NgModule({
  exports: [ApolloModule, HttpClientModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
