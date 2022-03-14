export interface IFile {
  pageID: number;
  subscriptionID: string;
  path: string;
  name: string;
  extension: string;
  description: string;
  date: string;
  tags: string[];
  isDeleted: boolean;
  status?: boolean;
  thumbnail?: string;
  deleteable: boolean;
  type: string;
  identifyID: string;
  ref: string;
}

export interface IFilesInfo {
  imageSize: string;
  videoSize: string;
  totalSize: string;
}

export interface ISystemFilesInfo {
  messageSize: string;
  productSize: string;
  totalSize: string;
}

export interface IFileUpload {
  file: any;
  name: string;
  tags: string[];
  description: string;
}

export interface IFileReturnValue {
  filePath: string;
  fileName: string;
  fileExtension: string;
  thumbnail: string;
}
export enum FileType {
  GQLFILE = 'GQLFILE',
  READABLE = 'READABLE',
}
