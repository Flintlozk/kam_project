import {
  asyncNatsPublisher,
  natsOnWaitForResponse,
  natsOnWaitForQueueTrigger,
  natsOnWaitToStartProcess,
  onWaitFor,
  triggerNatsProcess,
  triggerNatsResponse,
  triggerNextPublisher,
} from '@reactor-room/itopplus-back-end-helpers';
import { consumerOpts, NatsConnection, StringCodec } from 'nats';
import { JsMsgImpl } from 'nats/lib/nats-base-client/jsmsg';
import { hostname } from 'os';
// import { hostname } from 'os';
import { pid } from 'process';
// 2 CASE
// Production / Staging --> SUB ALL (BY SUBSCIPTION ID) / PAGE ?
// If not have any product yet (Not SUB); ?
// DEV Sub only match startcont rule args 1;

//#region NATs Core
export const runExampleNATSCore = (nc: NatsConnection) => {
  const sc = StringCodec();
  const sub = nc.subscribe('hello');
  (async () => {
    for await (const m of sub) {
      console.log(`[${sub.getProcessed()}]: ${sc.decode(m.data)}`);
    }
    console.log('subscription closed');
  })();

  nc.publish('hello', sc.encode('world1'));
  nc.publish('hello', sc.encode('again2'));
};
//#endregion

//#region JetStream
// const stream = 'mystream';
// const subj = `mystream.*`;

interface ExampleIncomingData {
  darthVader: string;
}

export const someLogicThatNeedTimeToProcess = async (natsConnection: NatsConnection, jobName: string, data: ExampleIncomingData, client): Promise<boolean> => {
  console.log(jobName, 'wait for process to trigger');
  const result = await natsOnWaitToStartProcess(natsConnection, jobName, 10);

  if (result.status) {
    console.log(jobName, 'processing 🚧');
    // client
    await onWaitFor(8);
    console.log(jobName, 'processed ⭐');
    triggerNextPublisher(natsConnection, jobName, 'OK');
  } else {
    console.log(jobName, 'has an error 💀');
    triggerNextPublisher(natsConnection, jobName, 'NO');
  }

  return result.status;
};

export const startNatsExample = async (nc: NatsConnection, stream: string, pageID: number, uniq: number) => {
  const jobName = 'FETCH:' + pageID + '_' + uniq;
  console.time(jobName);
  // console.log('stream', stream, 'jobName', jobName);
  const data = { darthVader: 'I AM YOUR FATHER' };

  const client = {}; // Begin Transaction
  const listener = asyncNatsPublisher(nc, stream, pageID, { jobName, data });
  const handler = someLogicThatNeedTimeToProcess(nc, jobName, data, client);
  const result = await Promise.all([listener, handler]);

  if (result[1]) {
    // client COMMIT
  } else {
    // client ROLLBACK
  }

  console.log(jobName, 'status ', result[1] ? '✔️' : '❌');
  console.timeEnd(jobName);
};

export const runExampleJS = async (nc: NatsConnection, pageID: number, round: number, stream: string, uniq: string) => {
  // const stream = 'mystream';
  const subj = `${stream}.${pageID}`;
  // const subj = `${stream}.${pageID}`;

  const js = await nc.jetstream();
  // const jsm = await nc.jetstreamManager();
  //---------------------- อันตรายนะ อย่าเอาบรรทัดนี้ขึ้น Production -------------------
  // await jsm.streams.purge(stream);
  //   await jsm.streams.delete(stream);
  ///----------------------------------------------------------------------------

  for (let i = 0; i < round; i++) {
    const examplePayload = {
      JOBID: uniq + '_' + pid + '-_' + i + '_P:' + pageID + '_' + Date.now(),
      information: 'HELLO.' + i,
    };
    await js.publish(`${subj}`, Buffer.from(JSON.stringify(examplePayload)));
    console.log('PUB :', examplePayload.JOBID, 'at', stream, pageID, new Date());
    const data = { darthVader: 'I AM YOUR FATHER' };
    const P1 = natsOnWaitForResponse(nc, examplePayload.JOBID);
    const P2 = someLogicThatNeedTimeToProcess(nc, examplePayload.JOBID, data, {});
    const responose = await Promise.all([P1, P2]);

    console.log('//[LOG]: responose', responose);
    // waitUntilMessageDone(examplePayload.JOBID, nc, (message) => {
    //   console.log('   DONE JOB ID: ', Buffer.from(message.data).toString(), 'at', stream, new Date());
    // });
  }
};

export const runExampleJSSub = async (nc: NatsConnection, streamName: string) => {
  const stream = streamName;
  const subj = `${streamName}.*`;

  try {
    const jsm = await nc.jetstreamManager({
      timeout: 120000,
    });
    const js = nc.jetstream();
    const opts = consumerOpts();
    opts.manualAck();
    opts.deliverGroup('queue');
    opts.queue('q');
    opts.durable(hostname());
    opts.deliverTo(streamName);

    try {
      await jsm.streams.delete(stream);
    } catch (ex) {
      //   console.log('CANT DEL', streamName);
    }
    await jsm.streams.add({ name: stream, subjects: [subj] });
    //---------------------- อันตรายนะ อย่าเอาบรรทัดนี้ขึ้น Production -------------------
    await jsm.streams.purge(stream);
    ///----------------------------------------------------------------------------

    const result = await js.subscribe(`${subj}`, opts);

    console.log('SUB TO:', subj);
    const done = async () => {
      setInterval(() => {
        console.log(streamName, ' LISTENING');
      }, 1000);

      for await (const m of result) {
        const message = m as JsMsgImpl;
        const payload = JSON.parse(Buffer.from(message.data).toString());
        console.log('//[LOG]: payload', payload);
        const someData = { Data: 'YES !!' };
        triggerNatsProcess(nc, payload.jobName, someData);
        const nextQueue = await natsOnWaitForQueueTrigger(nc, payload.jobName);
        console.log(nextQueue);
        triggerNatsResponse(nc, payload.jobName, someData);
        console.log('//[LOG]: nextQueue', nextQueue);
        message.ack();
      }
    };
    await done;
    result.destroy();
  } catch (ex) {
    console.log('//------------------------------------------------------------>[LOG]: ex', ex.message, streamName);
    console.log('//[LOG]: subj', subj);
    console.log('//[LOG]: stream', stream);
    throw ex;
  }
};
//#endregion

//#region ProduectJetStream
export const runProjectExampleJS = async (nc: NatsConnection) => {
  const jsm = await nc.jetstreamManager();
  const js = await nc.jetstream();
  const opts = consumerOpts();
  opts.manualAck();
  // opts.ackAll();
  opts.queue('q');
  opts.durable('me');
  opts.deliverTo('local');

  const stream = 'PRODUCT';
  const subj = `PRODUCT.*`;

  await jsm.streams.add({ name: stream, subjects: [subj] });
  //---------------------- อันตรายนะ อย่าเอาบรรทัดนี้ขึ้น Production -------------------
  // await jsm.streams.purge('PRODUCT_RESPONSE');
  // await jsm.streams.delete('PRODUCT_RESPONSE');
  ///----------------------------------------------------------------------------

  const result = await js.subscribe(`${subj}`, opts);
  const done = (async () => {
    for await (const m of result) {
      const inTime = new Date();
      console.time('IN');
      console.log('publishNats');
      console.log('----------------------------------------------------------------------------');
      console.log('m.seq', m.seq);
      console.log('payload:', JSON.parse(m.data.toString()));
      console.log('----------------------------------------------------------------------------');
      console.log('wait for 5 secs');
      await onWaitFor(10);
      console.log('DONE');
      m.ack();
      js.publish(
        `PRODUCT_RESPONSE.pageID:91`,
        Buffer.from(
          JSON.stringify({
            seq: m.seq,
            status: true,
            start: inTime,
            end: new Date(),
          }),
        ),
      );
      console.log('m.ack()');
    }
  })();
  await done;
  result.destroy();
};
//#endregion

// t Generator.next (<anonymous>)
//     at fulfilled (/home/flintlozk/Projects/reactor-room/node_modules/nats/lib/nats-base-client/jsbaseclient_api.js:19:58)
//     at processTicksAndRejections (internal/process/task_queues.js:95:5)
// (node:48282) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). To terminate the node process on unhandled promise rejection, use the CLI flag `--unhandled-rejections=strict` (see https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode). (rejection id: 81)
// (node:48282) UnhandledPromiseRejectionWarning: Error: no stream matches subject
//     at JetStreamClientImpl.<anonymous> (/home/flintlozk/Projects/reactor-room/node_modules/nats/nats-base-client/jsbaseclient_api.ts:97:13)
//     at Generator.next (<anonymous>)
//     at fulfilled (/home/flintlozk/Projects/reactor-room/node_modules/nats/lib/nats-base-client/jsbaseclient_api.js:19:58)
//     at processTicksAndRejections (internal/process/task_queues.js:95:5)
// (node:48282) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). To terminate the node process on unhandled promise rejection, use the CLI flag `--unhandled-rejections=strict` (see https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode). (rejection id: 82)
// (node:48282) UnhandledPromiseRejectionWarning: Error: no stream matches subject
//     at JetStreamClientImpl.<anonymous> (/home/flintlozk/Projects/reactor-room/node_modules/nats/nats-base-client/jsbaseclient_api.ts:97:13)
//     at Generator.next (<anonymous>)
//     at fulfilled (/home/flintlozk/Projects/reactor-room/node_modules/nats/lib/nats-base-client/jsbaseclient_api.js:19:58)
//     at processTicksAndRejections (internal/process/task_queues.js:95:5)
// (node:48282) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). To terminate the node process on unhandled promise rejection, use the CLI flag `--unhandled-rejections=strict` (see https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode). (rejection id: 83)
// (node:48282) UnhandledPromiseRejectionWarning: Error: no stream matches subject
//     at JetStreamClientImpl.<anonymous> (/home/flintlozk/Projects/reactor-room/node_modules/nats/nats-base-client/jsbaseclient_api.ts:97:13)
