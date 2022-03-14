import { connect, ConnectionOptions, NatsConnection } from 'nats';

export const connectToServer = async (servers: string[]): Promise<NatsConnection> => {
  try {
    const connection: ConnectionOptions = {
      name: `MACHINE_PROCEDUCE_${process.pid}`,
      pingInterval: 10 * 1000,
      maxReconnectAttempts: 3,
      reconnect: true,
      reconnectTimeWait: 10 * 1000,
      servers: servers,
      verbose: false,
      debug: false,
    };

    const nc = await connect(connection);
    return nc;
  } catch (err) {
    console.log(`Nat Error connection to: ${servers}`);
  }
};
