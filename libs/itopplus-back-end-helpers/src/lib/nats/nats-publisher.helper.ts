import { NatsConnection } from 'nats';
import { INatsProcessReturn } from '.';
import { EnumNatsHandlerType, parseJobName, natsOnWaitForResponse } from './nats-subscription.helper';

export interface NatsPayload {
  timestamp: number;
}

export const asyncNatsPublisher = async <T>(
  nc: NatsConnection,
  stream: string,
  pageID: number,
  params: {
    jobName: string;
    data?: T;
    timestamp?: number;
  },
  timeoutSecond?: number,
): Promise<INatsProcessReturn> => {
  const { jobName } = params;
  const subject = `${stream}.${pageID}`;
  const js = nc.jetstream();
  const data = JSON.stringify({ ...params, timestamp: new Date().valueOf() });
  await js.publish(`${subject}`, Buffer.from(data));
  return natsOnWaitForResponse(nc, jobName, timeoutSecond);
};

export const triggerNextPublisher = <T>(natsConnection: NatsConnection, jobName: string, data: T): void => {
  const name = parseJobName(jobName, EnumNatsHandlerType.QUEUE_TRIGGER);
  natsConnection.publish(name, Buffer.from(JSON.stringify(data)));
  return;
};
export const triggerNatsResponse = <T>(natsConnection: NatsConnection, jobName: string, data: T): void => {
  natsConnection.publish(`${jobName}_RESPONSE`, Buffer.from(JSON.stringify(data)));
  return;
};
export const triggerNatsProcess = <T>(natsConnection: NatsConnection, jobName: string, data: T): void => {
  natsConnection.publish(`${jobName}`, Buffer.from(JSON.stringify(data)));
  return;
};
