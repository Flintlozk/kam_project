import { environmentLib } from '@reactor-room/environment-services-frontend';
import { textDefaultValue } from './default';

const DEFAULT_ROUTE = 'follows/list/all/1';

export const environment = {
  ...environmentLib,
  DEFAULT_ROUTE,
  hmr: true,
};

export const textDefault = {
  ...textDefaultValue,
};
