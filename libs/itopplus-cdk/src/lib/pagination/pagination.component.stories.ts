import { text, number, boolean, object } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import { PaginationComponent } from './pagination.component';
import { MaterialModule } from '../material-module';
import { storiesOf } from '@storybook/angular';

export const actionsData = {
  changePage: action('changePage'),
};

storiesOf('Pagination', module).add('Simple', () => ({
  component: PaginationComponent,
  moduleMetadata: {
    imports: [MaterialModule],
  },
  props: {
    pageSizeOptions: object('pageSizeOptions', [5, 10, 25, 100]),
    pageSize: number('pageSize', 10),
    length: number('length', 100),
    changePage: actionsData.changePage,
  },
}));
