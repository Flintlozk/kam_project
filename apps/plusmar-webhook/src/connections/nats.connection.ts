import { connect, ConnectionOptions, NatsConnection } from 'nats';

export const connectToServer = async (server: string[]): Promise<NatsConnection> => {
  try {
    const connection: ConnectionOptions = { servers: server };
    const nc = await connect(connection);
    return nc;
  } catch (err) {
    console.log(`Nat Error connection to: ${server}`);
  }
};
