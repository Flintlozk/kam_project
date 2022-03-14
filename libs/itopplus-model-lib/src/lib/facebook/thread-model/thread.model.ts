export interface IThread {
  audienceID: number;
  pageID: number;
  metadata: string;
  createdAt: Date;
  user?: IFacebookThreadUserMetadata;
}

export interface IThreadContext {
  pageID: string;
  threads: [IThread] | [];
}

export interface IFacebookThreadUser {
  id: string;
  name: string;
  profileImage: string;
  online: boolean;
}

export interface IMessageUsers {
  audienceID: number;
  pageID: number;
}

export interface IFacebookThreadUserMetadata {
  id?: string;
  name?: string;
  email?: string;
  first_name?: string;
  last_name?: string;
  profile_pic?: string;
  picture?: {
    data?: {
      height: number;
      is_silhouette: boolean;
      url: string;
      width: number;
    };
  };
  data?: {
    url?: string;
  };
  can_reply?: boolean;
}
