https://github.com/nats-io/nats.deno/blob/main/jetstream.md

// delete the 5th message in the stream, securely erasing it
// await jsm.streams.deleteMessage(stream, 5);

// purge all messages in the stream, the stream itself remains.
// await jsm.streams.purge(stream);

// purge all messages with a specific subject (filter can be a wildcard)
// await jsm.streams.purge(stream, { filter: 'a.b' });

// purge messages with a specific subject keeping some messages
// await jsm.streams.purge(stream, { filter: 'a.c', keep: 5 });

// purge all messages with upto (not including seq)
// await jsm.streams.purge(stream, { seq: 90 });

// purge all messages with upto sequence that have a matching subject
// await jsm.streams.purge(stream, { filter: 'a.d', seq: 100 });

// find a stream that stores a specific subject:
// const name = await jsm.streams.find('mystream.a');

// retrieve info about the stream by its name
// const si = await jsm.streams.info(name);

// update a stream configuration
// si.config.subjects?.push('a.b');

// get a particular stored message in the stream by sequence
// this is not associated with a consumer
// const sm = await jsm.streams.getMessage(stream, { seq: 1 });
// console.log(sm.seq);

// list all consumers for a stream:
// const consumers = await jsm.consumers.list(stream).next(null);
// consumers.forEach((ci) => {
// console.log(ci);
// });

// add a new durable pull consumer
// await jsm.consumers.add(stream, {
// durable_name: 'me',
// ack_policy: AckPolicy.Explicit,
// });

// retrieve a consumer's configuration
// const ci = await jsm.consumers.info(stream, 'me');

// delete a particular consumer
// await jsm.consumers.delete(stream, 'me');
