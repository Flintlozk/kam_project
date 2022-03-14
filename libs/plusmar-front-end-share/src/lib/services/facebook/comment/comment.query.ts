import gql from 'graphql-tag';

export const GET_COMMENTS = gql`
  query getComments($audienceID: Int) {
    getComments(audienceID: $audienceID) {
      _id
      text
      pageID
      audienceID
      postID
      commentID
      payload
      createdAt
      sentBy
    }
  }
`;

export const GET_LATEST_COMMENT = gql`
  query getLatestComment($audienceID: Int) {
    getLatestComment(audienceID: $audienceID) {
      _id
      text
      pageID
      audienceID
      postID
      commentID
      payload
      createdAt
      sentBy
      sender {
        user_id
        user_name
      }
    }
  }
`;
export const GET_ACTIVE_COMMENT_ON_PRIVATE_MESSAGE = gql`
  query getActiveCommentOnPrivateMessage($audienceID: Int) {
    getActiveCommentOnPrivateMessage(audienceID: $audienceID) {
      _id
      text
      pageID
      audienceID
      postID
      commentID
      payload
      createdAt
      sentBy
      attachment
      replies {
        _id
        text
        source
        pageID
        audienceID
        postID
        commentID
        payload
        attachment
        sentBy
        createdAt
        hidden
        sender {
          user_id
          user_name
        }
      }
      sender {
        user_id
        user_name
      }
    }
  }
`;

export const COMMENT_RECEIVED = gql`
  subscription commentReceived($audienceID: Int, $postID: String) {
    commentReceived(audienceID: $audienceID, postID: $postID) {
      _id
      text
      source
      pageID
      audienceID
      postID
      commentID
      sentBy
      payload
      attachment
      isReply
      allowReply
      createdAt
      method
      hidden
    }
  }
`;

export const GET_COMMENTS_BY_POST_ID = gql`
  query getCommentsByPostID($audienceID: Int, $postID: String) {
    getCommentsByPostID(audienceID: $audienceID, postID: $postID) {
      _id
      text
      source
      pageID
      audienceID
      postID
      commentID
      payload
      attachment
      sentBy
      createdAt
      allowReply
      hidden
      replies {
        _id
        text
        source
        pageID
        audienceID
        postID
        commentID
        payload
        attachment
        sentBy
        createdAt
        hidden
        sender {
          user_id
          user_name
        }
      }
      sender {
        user_id
        user_name
      }
    }
  }
`;

export const REPLY_TO_COMMENT = gql`
  mutation replyToComment($reply: CommentReplyInput) {
    replyToComment(reply: $reply) {
      id
    }
  }
`;
export const EDIT_COMMENT = gql`
  mutation editComment($comment: CommentReplyInput) {
    editComment(comment: $comment) {
      id
    }
  }
`;
export const REMOVE_COMMENT = gql`
  mutation removeComment($comment: CommentRemoveInput) {
    removeComment(comment: $comment) {
      success
    }
  }
`;
export const HIDE_COMMENT = gql`
  mutation hideComment($comment: CommentHideInput) {
    hideComment(comment: $comment) {
      success
    }
  }
`;
export const UN_HIDE_COMMENT = gql`
  mutation unhideComment($comment: CommentHideInput) {
    unhideComment(comment: $comment) {
      success
    }
  }
`;
