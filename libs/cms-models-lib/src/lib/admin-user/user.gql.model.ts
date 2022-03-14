import gql from 'graphql-tag';

export const UserManagementTypeDef = gql`
  type user {
    name: String
    email: String
    role: String
  }
  input setInvitationUser {
    email: String!
    role: String!
  }
  extend type Query {
    getAllUser: [user]
  }
  extend type Mutation {
    sendInvitation(input: setInvitationUser): HTTPResult
  }
`;
