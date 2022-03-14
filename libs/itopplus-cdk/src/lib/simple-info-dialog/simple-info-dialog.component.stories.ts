import { SimpleInfoDialogComponent } from './simple-info-dialog.component';
import { storiesOf } from '@storybook/angular';

storiesOf('SimpleInfoDialogComponent', module).add('Default', () => ({
  component: SimpleInfoDialogComponent,
  template: `
    simple dismiss button dialog for showing information, provide #title as input, 
    and add selector as a class .content for the content of the dialog
    `,
}));
