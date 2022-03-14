import { NgModule } from '@angular/core';
import { getCookie } from '@reactor-room/itopplus-front-end-helpers';
import { environment } from '../environments/environment';
import { Subject } from 'rxjs';
import { EnumAuthScope } from '@reactor-room/itopplus-model-lib';

import { OperationDefinitionNode } from 'graphql';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApolloLink, from, InMemoryCache, split } from '@apollo/client/core';
import { WebSocketLink } from '@apollo/client/link/ws';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { extractFiles } from 'extract-files';

const uri = `${environment.backendUrl}/graphql`;
let wsUri = `${environment.backendUrl}/graphql`;

export interface InterceptHeaders {
  Authorization: string;
  access_token?: string;
  cookie?: any;
  page_index?: number;
}

export const webSocketErrorSubject = new Subject<Error[]>();

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
  const basic = setContext((operation, context) => {
    return {
      headers: {
        Accept: 'charset=utf-8',
      },
    };
  });
  const headerFn = () => {
    const header = {} as InterceptHeaders;
    const accessToken = getCookie('access_token');
    const pageIndex = getCookie('page_index');
    //TODO: Must implement subscription index for license change

    if (accessToken !== null) header.access_token = accessToken || '';
    if (pageIndex !== null) header.page_index = Number(pageIndex) || 0;
    return header;
  };
  const auth = setContext((operation, context) => {
    const header = headerFn();
    return {
      headers: {
        'app-module': EnumAuthScope.SOCIAL,
        ...header,
      },
    };
  });
  const http = httpLink.create({ uri: uri, withCredentials: true, extractFiles });
  //Replace the http,https protocol with empty for attach ws,wss protocol instead.
  wsUri = wsUri.replace('http:', '').replace('https:', '');
  const protocol = environment.production ? 'wss://' : 'ws://';
  const subscriptionClient = new SubscriptionClient(protocol + wsUri, {
    reconnect: true,
    lazy: true,
    connectionParams: headerFn,
    connectionCallback: (errors) => {
      webSocketErrorSubject.next(errors);
    },
  });
  const ws = new WebSocketLink(subscriptionClient);
  const link = split(
    ({ query }) => {
      const definition = getMainDefinition(query) as OperationDefinitionNode;
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    ws,
    http,
  );
  return {
    link: from([basic, auth, link]),
    cache: new InMemoryCache({ addTypename: false }),
    fetchOptions: {
      credentials: 'include',
    },
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all',
      },
    },
    // https://stackoverflow.com/questions/55970271/found-client-directives-in-query-but-no-client-resolvers-were-specified-warni#answer-55970913
    resolvers: {},
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
