import { text, number, boolean } from '@storybook/addon-knobs';
import { action } from '@storybook/addon-actions';

import { GoogleLoginComponent } from './google-login.component';
import { from } from 'rxjs';

export default {
  title: 'GoogleLoginComponent',
};

export const actionsData = {
  callBack: action('callBack'),
};

export const primary = () => ({
  moduleMetadata: {
    import: [],
  },
  component: GoogleLoginComponent,
  props: {
    googleOauthClientId: text('googleOauthClientId', '971440548408-hvntf3ihgg95i8pogbrvuuuvd9gs9hsa.apps.googleusercontent.com'),
    onCallBack: actionsData.callBack,
  },
});
