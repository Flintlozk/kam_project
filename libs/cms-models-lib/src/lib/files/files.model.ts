export interface IFiles {
  pageID: number;
  subscriptionID: string;
  files: IFile[];
  ref: string;
}

export interface IFilesInfo {
  imageSize: number;
  videoSize: number;
  totalSize: number;
}

export interface IFileUpload {
  file: any;
  name: string;
  tags: string[];
  description: string;
}

export interface IFile {
  path: string;
  name: string;
  extension: string;
  description: string;
  date: string;
  tags: string[];
  isDeleted: boolean;
  status?: boolean;
  thumbnail: string;
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
