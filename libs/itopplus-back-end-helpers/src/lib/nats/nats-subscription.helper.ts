import { consumerOpts, ConsumerOptsBuilder, JetStreamSubscription, NatsConnection } from 'nats';
import { JsMsgImpl } from 'nats/lib/nats-base-client/jsmsg';
import { MsgImpl } from 'nats/lib/nats-base-client/msg';
import { hostname } from 'os';
import { getDayjs, getDiffrentTime, parseTimestampToDayjs } from '../utc.helper';
import { triggerNatsProcess, triggerNatsResponse } from './nats-publisher.helper';

interface MessageReturn {
  ({ isError: NatsError, message: MsgImpl }): void;
}
export interface INatsProcessReturn {
  isError: Error;
  message: string;
  status: boolean;
}

export enum EnumNatsHandlerType {
  QUEUE_TRIGGER = 'QUEUE_TRIGGER',
  RESPONSE = 'RESPONSE',
  PROCESSED = 'PROCESSED',
}

const NatsHandlerType = {
  QUEUE_TRIGGER: '_QUEUE_TRIGGER',
  RESPONSE: '_RESPONSE',
  PROCESSED: '_PROCESSED',
};

export const getJetStreamConsumerOption = (streamName: string): ConsumerOptsBuilder => {
  const opts = consumerOpts();
  opts.manualAck();
  opts.deliverGroup('queue');
  opts.queue('q');
  opts.durable(hostname());
  opts.deliverTo(streamName);

  return opts;
};

export enum EnumNatsSupportFeature {
  PRODUCT_INVENTORY = 'PRODUCT_INVENTORY',
}

export const getStreamNameByFeature = (feature: EnumNatsSupportFeature, pageID: number): string => {
  const features = {
    PRODUCT_INVENTORY: `PRODUCT_INVENTORY_${pageID}`,
  };
  return features[feature];
};

export enum EnumNatsJobname {
  UPDATE_INVENTORY = 'UPDATE_INVENTORY',
  RESERVE_INVENTORY = 'RESERVE_INVENTORY',
}
export const getJobNameByFeature = (feature: EnumNatsJobname, uniq: string): string => {
  const features = {
    UPDATE_INVENTORY: `UPDATE_PRODUCT_INV_${uniq}`,
    RESERVE_INVENTORY: `RESERVED_PRODUCT_INV_${uniq}`,
  };
  return features[feature];
};

export const parseJobName = (jobName: string, type: EnumNatsHandlerType): string => {
  return `${jobName}${NatsHandlerType[type]}`;
};

export const getNatsSubscription = (natsConnection: NatsConnection, streamName: string, acknowledgeTimeoutInSencond?: number): Promise<boolean> => {
  return new Promise((resolve) => {
    natsSubscription(
      natsConnection,
      streamName,
      (error, value) => {
        console.log(streamName, 'Subscribed ⭐');
        // console.log('//[LOG]: error,value', error, value);
        resolve(true);
      },
      acknowledgeTimeoutInSencond,
    );
  });
};

export const natsSubscription = async (natsConnection: NatsConnection, streamName: string, callback: (error: string, value: boolean) => void, timeoutSecond?: number) => {
  try {
    const stream = streamName;
    const subj = `${streamName}.*`;
    const options = getJetStreamConsumerOption(streamName);

    const js = natsConnection.jetstream();
    const jsm = await natsConnection.jetstreamManager({
      timeout: 120000,
    });

    try {
      await jsm.streams.delete(stream); // จำเป็นต้องใช้ เพื่อให้เริ่มทำงานใหม่  กรณี Restart ไม่งั้นจะไม่มี data เข้า
    } catch (ex) {}
    await jsm.streams.add({ name: stream, subjects: [subj] });
    await jsm.streams.purge(stream); // จำเป็นต้องใช้ เพื่อให้เริ่มทำงานใหม่  กรณี Restart ไม่งั้นจะไม่มี data เข้า

    const subscription = await js.subscribe(`${subj}`, options);
    callback(null, true);

    const listen = natsMessageListener(natsConnection, subscription, timeoutSecond);
    await listen;
    //
    subscription.destroy();
  } catch (ex) {
    callback(ex.message, false);
  }
};

export const natsMessageListener = (natsConnection: NatsConnection, subscription: JetStreamSubscription, timeoutSecond?: number): Promise<void> => {
  return (async () => {
    for await (const m of subscription) {
      const message = m as JsMsgImpl;
      if (!message.didAck) {
        const payload = JSON.parse(Buffer.from(message.data).toString());
        const { jobName, timestamp } = payload;
        console.time('SUB_' + jobName);

        const diffInSecond = getDiffrentTime(parseTimestampToDayjs(timestamp), getDayjs(), 'second');
        const isTimeOut = diffInSecond >= timeoutSecond;
        if (!isTimeOut) {
          triggerNatsProcess(natsConnection, jobName, 'TRIGGER'); // ? Trigger Feature Function

          const waitForTriggerResult = await natsOnWaitForQueueTrigger(natsConnection, jobName, timeoutSecond); // ? Wait til Feature function complete
          const { isError, status } = waitForTriggerResult;
          if (!status) {
            console.log(isError.message);
          }
          triggerNatsResponse(natsConnection, jobName, 'RESPONSE'); // ? Response to Main caller
        } else {
          console.log(jobName, '💀 TIMEOUT');
        }
        console.timeEnd('SUB_' + jobName);

        message.ack(); // Message acknowledge
      }
    }
  })();
};

// For use on Client publisher
export const natsOnWaitToStartProcess = (natsConnection: NatsConnection, jobName: string, timeOutSecond?: number): Promise<INatsProcessReturn> => {
  return new Promise(processHandler(natsConnection, jobName, timeOutSecond));
};
export const natsOnWaitForResponse = (natsConnection: NatsConnection, jobName: string, timeOutSecond?: number): Promise<INatsProcessReturn> => {
  const name = parseJobName(jobName, EnumNatsHandlerType.RESPONSE);
  return new Promise(processHandler(natsConnection, name, timeOutSecond));
};

// For use on Subscription
export const natsOnWaitForQueueTrigger = (natsConnection: NatsConnection, jobName: string, timeOutSecond?: number): Promise<INatsProcessReturn> => {
  const name = parseJobName(jobName, EnumNatsHandlerType.QUEUE_TRIGGER);
  return new Promise(processHandler(natsConnection, name, timeOutSecond));
};

export const processHandler = (natsConnection: NatsConnection, jobName: string, timeOutSecond?: number): ((resolve: (INatsProcessReturn) => void) => void) => {
  return (resolve) => {
    procesCallback(
      natsConnection,
      jobName,
      ({ isError, message }) => {
        if (isError) {
          resolve({ isError: new Error(isError), message, status: false });
        } else {
          resolve({ isError, message, status: true });
        }
      },
      timeOutSecond,
    );
  };
};

const procesCallback = (natsConnection: NatsConnection, jobName: string, cb: MessageReturn, timeOutSecond?: number) => {
  const sub = natsConnection.subscribe(jobName, {
    timeout: timeOutSecond * 1000,
    callback: (error, message) => {
      if (error) {
        cb({ isError: handlerError(jobName, error.message), message: message as MsgImpl });
      } else {
        cb({ isError: null, message: message as MsgImpl });
      }
      sub.unsubscribe();
    },
  });
};

const handlerError = (jobName: string, type: string) => {
  switch (type) {
    case 'TIMEOUT':
      return `${jobName}_PROCESS_TIMEOUT`;
    default:
      return `${jobName}_${type.toLocaleUpperCase()}`;
  }
};
