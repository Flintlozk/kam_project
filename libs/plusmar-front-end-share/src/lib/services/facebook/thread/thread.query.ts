import gql from 'graphql-tag';

export const GET_USER_THREADS = gql`
  query getUserThreads($domain: String, $status: String) {
    getUserThreads(domain: $domain, status: $status) {
      pageID
      threads {
        _id
        audienceID
        pageID
        metadata
        createdAt
      }
    }
  }
`;

export const GET_THREAD_BY_USERS = gql`
  query getThreadByUsers($audienceID: Int) {
    getThreadByUsers(audienceID: $audienceID) {
      _id
      audienceID
      pageID
      metadata
      createdAt
    }
  }
`;

export const GET_USER_THREADS_TOTAL_COUNT = gql`
  query getUserThreadsTotalCount($domain: String, $status: String) {
    getUserThreadsTotalCount(domain: $domain, status: $status) {
      count
    }
  }
`;
