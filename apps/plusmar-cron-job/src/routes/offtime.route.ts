import { offTimeController } from '../controllers/offtime.controller';

export const offTimeRoute = (): void => {
  void offTimeController.offTimeCheckMessageToSendExternalEmail();
};
