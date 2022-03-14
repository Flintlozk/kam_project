import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { getCookie } from '@reactor-room/itopplus-front-end-helpers';
import { environment } from '../environments/environment';

import { OperationDefinitionNode } from 'graphql';
import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApolloLink, InMemoryCache, split } from '@apollo/client/core';
import { WebSocketLink } from '@apollo/client/link/ws';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
import { SubscriptionClient } from 'subscriptions-transport-ws';

import { Subject } from 'rxjs';
import { EnumAuthScope } from '@reactor-room/itopplus-model-lib';
import { extractFiles } from 'extract-files';

const uri = `${environment.cms.backendUrl}/graphql`;
let wsUri = `${environment.cms.backendUrl}/graphql`;

export interface InterceptHeaders {
  Authorization: string;
  access_token?: string;
  cookie?: any;
  page_index?: number;
}

export const webSocketErrorSubject = new Subject<Error[]>();

export function createApollo(httpLink: HttpLink) {
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
  // Get the authentication token from local storage if it exists
  const auth = setContext((operation, context) => {
    const header = headerFn();
    return {
      headers: {
        'app-module': EnumAuthScope.CMS,
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
  // using the ability to split links, you can send data to each link
  // depending on what kind of operation is being sent
  const link = split(
    // split based on operation type
    ({ query }) => {
      const definition = getMainDefinition(query) as OperationDefinitionNode;
      return definition.kind === 'OperationDefinition' && definition.operation === 'subscription';
    },
    ws,
    http,
  );
  return {
    link: ApolloLink.from([basic, auth, link]),
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
