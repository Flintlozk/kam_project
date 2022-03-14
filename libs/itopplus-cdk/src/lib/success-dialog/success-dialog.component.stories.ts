import { SuccessDialogComponent } from './success-dialog.component';
import { storiesOf } from '@storybook/angular';

storiesOf('SuccessDialogComponent', module)
  .add('Success', () => ({
    component: SuccessDialogComponent,
    template: `
    import SuccessDialogComponent in parent component
    in the method of openDialog, provide data as: <br/>
    <div>provide data.title and data.text as InnerHtml for content</div>
    `,
  }))
  .add('Error', () => ({
    component: SuccessDialogComponent,
    template: `
    <div>provide Input [isError]="true" in parent component</div>
    <div>provide data.title and data.text as InnerHtml for content</div>
    `,
  }));
