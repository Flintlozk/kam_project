import gql from 'graphql-tag';

export const UPLOAD_FILES = gql`
  mutation uploadFiles($files: [FileUploadInput]) {
    uploadFiles(files: $files) {
      status
      value
    }
  }
`;

export const TRASH_FILES = gql`
  mutation trashFiles($filePaths: [String]) {
    trashFiles(filePaths: $filePaths) {
      status
      value
    }
  }
`;

export const RECOVER_FILES = gql`
  mutation recoverFiles($filePaths: [String]) {
    recoverFiles(filePaths: $filePaths) {
      status
      value
    }
  }
`;

export const DELETE_FILES = gql`
  mutation deleteFiles($filePaths: [String]) {
    deleteFiles(filePaths: $filePaths) {
      status
      value
    }
  }
`;

export const EMPTY_FILES = gql`
  mutation emptyFiles {
    emptyFiles {
      status
      value
    }
  }
`;

export const GET_FILES_INFO = gql`
  query getFilesInfo {
    getFilesInfo {
      totalSize
      imageSize
      videoSize
    }
  }
`;
export const GET_SYSTEM_FILES_INFO = gql`
  query getSystemFilesInfo {
    getSystemFilesInfo {
      messageSize
      productSize
      totalSize
    }
  }
`;

export const GET_FILES = gql`
  query getFiles($skip: Int, $limit: Int) {
    getFiles(skip: $skip, limit: $limit) {
      path
      name
      extension
      description
      date
      tags
      thumbnail
      isDeleted
    }
  }
`;

export const GET_DELETED_FILES = gql`
  query getDeletedFiles($skip: Int, $limit: Int) {
    getDeletedFiles(skip: $skip, limit: $limit) {
      path
      name
      extension
      description
      date
      tags
      thumbnail
      isDeleted
    }
  }
`;
