import * as nodeSchedule from 'node-schedule';

export class SustainPubsubLifetimeService {
  constructor() {}

  sustainPubsubLifetime(): void {
    const scheduler = '*/30 * * * *'; // every 30 minutes
    nodeSchedule.scheduleJob(scheduler, async () => {
      console.log('Hello world');
    });
  }
}
