import { SustainPubsubLifetimeService } from '../services/sustain-pubsub-lifetime.service';

// Cronjob do as one workload on K8s
class SustainPubsubLifetimeController {
  public static instance;
  public static sustainPubsubLifetimeService: SustainPubsubLifetimeService;

  public static getInstance(): SustainPubsubLifetimeController {
    if (!SustainPubsubLifetimeController.instance) SustainPubsubLifetimeController.instance = new SustainPubsubLifetimeController();
    return SustainPubsubLifetimeController.instance;
  }

  constructor() {
    SustainPubsubLifetimeController.sustainPubsubLifetimeService = new SustainPubsubLifetimeService();
  }

  sustainPubsubLifetimeHandler(): void {
    void SustainPubsubLifetimeController.sustainPubsubLifetimeService.sustainPubsubLifetime();
  }
}

const Instance: SustainPubsubLifetimeController = SustainPubsubLifetimeController.getInstance();
export const sustainPubsubLifetimeController = {
  sustainPubsubLifetime: Instance.sustainPubsubLifetimeHandler,
};
