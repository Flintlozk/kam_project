import { text, number, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';
import { ChipcardListComponent } from './chipcard-list.component';
import { storiesOf } from '@storybook/angular';
import { MaterialModule } from '../material-module';

storiesOf('Auto Complete Inputbox', module).add('Simple', () => ({
  component: ChipcardListComponent,
  props: {},
  moduleMetadata: {
    imports: [MaterialModule],
  },
}));
