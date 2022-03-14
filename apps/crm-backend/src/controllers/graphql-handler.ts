import { IGQLContext } from '@reactor-room/crm-models-lib';
import { graphQLErrorHandler } from './graphql-error-handler';

export const graphQLHandler =
  ({ handler, validator }) =>
  async (parent: any, args: any, context: any) => {
    try {
      const returnValue = await handler(parent, args, context as IGQLContext);
      const validate = await validator(returnValue);
      return validate;
    } catch (err) {
      console.log('err ::::::::::>>> ', err);
      graphQLErrorHandler(err);
    }
  };
