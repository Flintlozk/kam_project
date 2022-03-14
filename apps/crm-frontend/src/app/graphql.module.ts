import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { getCookie } from '@reactor-room/itopplus-front-end-helpers';
import { environment } from '../environments/environment';

import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { ApolloLink, InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { extractFiles } from 'extract-files';

export interface InterceptHeaders {
  Authorization: string;
  access_token?: string;
}

const { gqlUrl: uri } = environment;
export function createApollo(httpLink: HttpLink) {
  const http = httpLink.create({ uri, extractFiles });
  const basic = setContext(() => {
    return {
      headers: {
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
        ...header,
      },
    };
  });

  return {
    link: ApolloLink.from([basic, auth, http]),
    cache: new InMemoryCache(),
    resolvers: {},
  };
}

@NgModule({
  exports: [HttpClientModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
