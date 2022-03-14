import { EnumAuthScope } from '@reactor-room/itopplus-model-lib';
import { MessageService, requireLogin } from '@reactor-room/itopplus-services-lib';
import { graphQLHandler } from 'libs/itopplus-back-end-helpers/src/lib/getAddressData/graphqlHandler';

class DevController {
  @requireLogin([EnumAuthScope.SOCIAL])
  async devRequest0Handler(): Promise<string> {
    const messageService = new MessageService();
    await messageService.aggregrateTotalMessage();
    return '(・ε・)';
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  async devRequest1Handler(): Promise<string> {
    return '(・ε・)';
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  devRequest2Handler(): string {
    return '(・ε・)';
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  async devRequest3Handler(parent, args: { value: string }, context): Promise<string> {
    return '(・ε・)';
  }
}
const devController: DevController = new DevController();
export const devResolver = {
  Query: {
    devRequest0: graphQLHandler({
      handler: devController.devRequest0Handler,
      validator: (x) => x,
    }),
    devRequest1: graphQLHandler({
      handler: devController.devRequest1Handler,
      validator: (x) => x,
    }),
    devRequest2: graphQLHandler({
      handler: devController.devRequest2Handler,
      validator: (x) => x,
    }),
    devRequest3: graphQLHandler({
      handler: devController.devRequest3Handler,
      validator: (x) => x,
    }),
  },
};
/**
 * TODO(developer): Uncomment these variables before running the sample.
 */
// const subscriptionName = 'YOUR_SUBSCRIPTION_NAME';
// const timeout = 60;
