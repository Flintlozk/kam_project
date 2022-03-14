export interface ContentContentModel {
  title: string;
  category: string;
  createdDate: string;
  status: ContentContentStatus;
  imgUrl: string;
}
export enum ContentContentStatus {
  PUBLISH = 'Published',
  HIDE = 'Hide',
}
