import { MessageService, WorkingHourService } from '@reactor-room/itopplus-services-lib';
import * as nodeSchedule from 'node-schedule';

export class OfftimeMessageProcessService {
  public messageService: MessageService;
  public workingHourService: WorkingHourService;
  constructor() {
    this.messageService = new MessageService();
    this.workingHourService = new WorkingHourService();
  }
  offTimeCheckMessageToSendExternalEmail(): void {
    const scheduler = '*/30 * * * *'; // every 30 minutes
    nodeSchedule.scheduleJob(scheduler, async () => {
      const messages = await this.messageService.getTempMessages();
      await this.workingHourService.sendNotifyUsersViaEmail(messages);
    });
  }
}
