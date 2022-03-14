import { sustainPubsubLifetimeController } from '../controllers/sustain-pubsub-lifetime.controller';

export const sustainPubsubLifetimeRoute = (): void => {
  void sustainPubsubLifetimeController.sustainPubsubLifetime();
};
