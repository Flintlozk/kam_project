import gql from 'graphql-tag';

export const FilesTypeDefs = gql`
  #   scalar Upload
  "Files Schema"
  type FilesModel {
    pageID: Int
    subscriptionID: String
    files: [FileModel]
    ref: String
  }
  type FileModel {
    path: String
    name: String
    extension: String
    description: String
    date: String
    tags: [String]
    thumbnail: String
    isDeleted: Boolean
  }

  type FilesInfoModel {
    imageSize: String
    videoSize: String
    totalSize: String
  }
  type SystemFilesInfoModel {
    messageSize: String
    productSize: String
    totalSize: String
  }

  input FileUploadInput {
    file: Upload
    name: String
    tags: [String]
    description: String
  }

  extend type Query {
    getFiles(skip: Int, limit: Int): [FileModel]
    getDeletedFiles(skip: Int, limit: Int): [FileModel]
    getFilesInfo: FilesInfoModel
    getSystemFilesInfo: SystemFilesInfoModel
  }

  extend type Mutation {
    uploadFiles(files: [FileUploadInput]): HTTPResult
    trashFiles(filePaths: [String]): HTTPResult
    recoverFiles(filePaths: [String]): HTTPResult
    deleteFiles(filePaths: [String]): HTTPResult
    emptyFiles: HTTPResult
  }
`;
