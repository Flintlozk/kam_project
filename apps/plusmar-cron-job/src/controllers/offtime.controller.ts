import { OfftimeMessageProcessService } from '../services/offtime-message-process.service';

class OffTimeController {
  public static instance;
  public static offtimeMessageProcessService: OfftimeMessageProcessService;

  public static getInstance(): OffTimeController {
    if (!OffTimeController.instance) OffTimeController.instance = new OffTimeController();
    return OffTimeController.instance;
  }

  constructor() {
    OffTimeController.offtimeMessageProcessService = new OfftimeMessageProcessService();
  }

  offTimeCheckMessageToSendExternalEmail(): void {
    void OffTimeController.offtimeMessageProcessService.offTimeCheckMessageToSendExternalEmail();
  }
}

const Instance: OffTimeController = OffTimeController.getInstance();
export const offTimeController = {
  offTimeCheckMessageToSendExternalEmail: Instance.offTimeCheckMessageToSendExternalEmail,
};
