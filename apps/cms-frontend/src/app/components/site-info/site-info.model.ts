export enum SiteStatusEnum {
  PUBLISH = 'publish',
  UNPUBLISH = 'unpublish',
}

export enum SiteStatusLabelEnum {
  PUBLISH = 'Published',
  UNPUBLISH = 'Unpublished',
}

export interface ISiteStatus {
  value: string;
  title: string;
}
