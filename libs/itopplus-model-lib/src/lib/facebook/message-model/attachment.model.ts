interface Image {
  height: number;
  src: string;
  width: number;
}

interface Media {
  image: Image;
  source: string;
}

interface Target {
  id: string;
  url: string;
}

interface Attachment {
  media: Media;
  target: Target;
  title: string;
  type: string;
  url: string;
}

export interface IAttachmentComment {
  attachment: Attachment;
  id: string;
}

export interface IPostAttachments {
  data: ISubAttachment[];
}

export interface ISubAttachment {
  subattachments: {
    data: Attachment[];
  };
}
