import { ClickOutsideDirective } from './click-outside.directive';
import { storiesOf } from '@storybook/angular';

storiesOf('ClickOutsideDirective', module).add('Default', () => ({
  directive: ClickOutsideDirective,
  template: `
    <div>Call #reactorRoomClickOutside in parent component, detect event by using (outside)="clickOutsideEvent($event)"</div>
    `,
}));
