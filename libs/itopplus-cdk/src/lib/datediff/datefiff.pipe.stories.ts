import { text, number, boolean, object } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import * as dayjs from 'dayjs';

import { DateDiffPipe } from './datediff.pipe';
import { MaterialModule } from '../material-module';
import { storiesOf } from '@storybook/angular';

export const actionsData = {
  changePage: action('changePage'),
};

storiesOf('DateDiff Pipe', module).add('Simple', () => ({
  template: `
    <div>Create Date Data: {{createDate | date:'short'}} : {{createDate | datediff}}</div>
  `,
  moduleMetadata: {
    imports: [MaterialModule],
    declarations: [DateDiffPipe],
  },
  props: {
    createDate: dayjs().subtract(10, 'day').toDate(),
  },
}));
