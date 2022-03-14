import { LoaderComponent } from './loader.component';
import { storiesOf } from '@storybook/angular';

storiesOf('LoaderComponent', module)
  .add('Component Loading', () => ({
    component: LoaderComponent,
    template: `
    <div>Call #reactor-room-loader and provide @Input() #text in the parents</div>
    `,
  }))
  .add('Full Page Loading', () => ({
    component: LoaderComponent,
    template: `
    <div>Call #reactor-room-loader and provide @Input() #text in the parents<br/></div>
    <div>enable @Input() [block]="true"</div>
    `,
  }));
