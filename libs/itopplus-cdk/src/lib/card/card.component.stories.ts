import { CardComponent } from './card.component';
import { storiesOf } from '@storybook/angular';

storiesOf('CardComponent', module)
  .add('Default', () => ({
    component: CardComponent,
    template: `
    <div>Call #reactor-room-card inside the parent component</div>
    `,
  }))
  .add('Styling', () => ({
    component: CardComponent,
    template: `
    <div>Call #reactor-room-card inside the parent component<br/></div>
    <div>Call input such as [padding]="'20px'" in parent component for custom style card<br/></div>
    `,
  }))
  .add('With Heading', () => ({
    component: CardComponent,
    template: `
    <div>Call #reactor-room-card inside the parent component<br/></div>
    <div>Enable input [withTitle]="true" in parent component<br/></div>
    <div>create a class name with card-title in parent component, custom title<br/></div>
    <div>If the card links to other page, provide [moreRouteLink]="'./link'"</div>
    `,
  }));
