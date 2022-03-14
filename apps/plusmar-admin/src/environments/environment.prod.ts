import { environmentLib } from '@reactor-room/environment-services-frontend';

export const environment = {
  ...environmentLib,
  facebookLoginScope: ['email', 'public_profile'],
};
