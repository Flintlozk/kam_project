import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { environment } from '../environments/environment';

import { APOLLO_OPTIONS, ApolloModule } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { from, InMemoryCache } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { extractFiles } from 'extract-files';

const uri = environment.gqlUrl;
export interface InterceptHeaders {
  Authorization: string;
  access_token?: string;
}

export function createApollo(httpLink: HttpLink): unknown {
  const basic = setContext(() => {
    return {
      headers: {
        Accept: 'charset=utf-8',
      },
    };
  });

  // Get the authentication token from local storage if it exists
  const auth = setContext(() => {
    const header = {} as InterceptHeaders;

    return {
      headers: {
        ...header,
      },
    };
  });

  return {
    link: from([basic, auth, httpLink.create({ uri, withCredentials: true, extractFiles })]),
    cache: new InMemoryCache({ addTypename: false }),
    fetchOptions: {
      credentials: 'include',
    },
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all',
      },
    },
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
