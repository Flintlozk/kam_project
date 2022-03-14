import { Client } from '@elastic/elasticsearch';
import os from 'os';
import * as winston from 'winston';
import * as winstonElasticSearch from 'winston-elasticsearch';
import { getUTCDayjs } from '@reactor-room/itopplus-back-end-helpers';

const esTransportOpts = (client: Client): winstonElasticSearch.ElasticsearchTransportOptions => {
  return {
    client,
    level: 'info',
    transformer: (logData) => {
      return {
        '@timestamp': getUTCDayjs().toDate().getTime(),
        severity: logData.level,
        message: `[Host: ${os.hostname} :][${logData.level}] LOG Message: ${logData.message}`,
        meta: {
          host: os.hostname,
        },
      };
    },
  };
};

export const esClient = new Client({
  cloud: {
    id: 'plusmar:YXNpYS1zb3V0aGVhc3QxLmdjcC5lbGFzdGljLWNsb3VkLmNvbSRkMWY0MTNlMTc0ZmU0ZjA2OWM5ZDljZTdmNmVmZjAwNiRhZGY0MTUzYWIwYzU0OTMwOWNjYmVjZTA2OTc2MTBhNg==',
  },
  auth: {
    username: 'elastic',
    password: 'yF0coptLr5AJQ337HyO32fZy',
  },
});

export const createLogger = (client: Client): winston.Logger => {
  return winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [new winstonElasticSearch.ElasticsearchTransport(esTransportOpts(client))],
  });
};
