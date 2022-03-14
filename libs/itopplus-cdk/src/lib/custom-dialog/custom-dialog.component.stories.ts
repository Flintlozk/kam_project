import { CustomDialogComponent } from './custom-dialog.component';
import { storiesOf } from '@storybook/angular';

storiesOf('CustomDialogComponent', module).add('Default', () => ({
  component: CustomDialogComponent,
  template: `
    <div>Call #reactor-room-loader in the parent component<br/></div>
    <div>Call selector by using class name: head, content, footer<br/></div>
    `,
}));
