import gql from 'graphql-tag';

const property = `
_id
postID
payload {
  id
  message
  created_time
  full_picture
  attachments {
    data {
      subattachments {
        data {
          media {
            image {
              height
              src
              width
            }
          }
          target {
            id
            url
          }
          type
          url
        }
      }
    }
  }
}
createdAt
`;

export const GET_POST_BY_ID = gql`
  query getPostByID($ID: ID) {
    getPostByID(ID: $ID) {
      ${property}
    }
  }
`;
export const UPDATE_POST_BY_ID = gql`
  query updatePostByID($postID: String) {
    updatePostByID(postID: $postID) {
      ${property}
    }
  }
`;

export const GET_ALL_POSTS = gql`
  query getPosts($audienceID: Int) {
    getPosts(audienceID: $audienceID) {
      ${property}
    }
  }
`;

export const POST_RECEIVED = gql`
  subscription postReceived($audienceID: Int) {
    postReceived(audienceID: $audienceID) {
      postID
      audienceID
      payload {
        message
      }
    }
  }
`;
