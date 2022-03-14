import gql from 'graphql-tag';

export const getUsers = gql`
  query getUsers {
    getAllUser {
      name
      email
      role
    }
  }
`;

export const sendInvitationByEmail = gql`
  mutation sendEmail($input: setInvitationUser) {
    sendInvitation(input: $input) {
      status
      value
    }
  }
`;
