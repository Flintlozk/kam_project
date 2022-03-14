import gql from 'graphql-tag';

export const VisitorTypeDefs = gql`
  "Visitor Schema"
  type VisitorResponse {
    pageID: Int
    visitor: Int
  }

  type Query {
    getVisitor(pageID: Int): VisitorResponse
  }

  type Mutation {
    setVisitor(pageID: Int, visitor: Int): VisitorResponse
  }

  type Subscription {
    visitorSubscription(pageID: Int): VisitorResponse
  }
`;

export const SUBSCRIPTION_VISITOR = gql`
  subscription visitorSubscription($pageID: Int) {
    visitorSubscription(pageID: $pageID) {
      pageID: Int
      visitor: Int
    }
  }
`;
