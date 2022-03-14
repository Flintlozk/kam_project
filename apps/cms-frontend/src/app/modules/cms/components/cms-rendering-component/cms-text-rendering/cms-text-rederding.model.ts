import { Range } from 'ngx-quill';
import Quill from 'quill';

export interface ITextSelectionEvent {
  editor: Quill;
  oldRange: Range;
  range: Range;
  source: string;
}

export interface ITextLink {
  href: string;
  url: string;
  type: string;
  parent: string;
}
