/* eslint-disable @typescript-eslint/no-explicit-any */
import { graphQLErrorHandler } from './graphqlErrorHandler';
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const graphQLHandler =
  ({ handler, validator }) =>
  async (parent: any, args: any, context: any) => {
    try {
      const returnValue = await handler(parent, args, context);
      const validate = await validator(returnValue);
      return validate;
    } catch (err) {
      console.log('!!!!', err);
      graphQLErrorHandler(err);
    }
  };
