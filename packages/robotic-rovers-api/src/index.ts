import 'reflect-metadata';

import * as Hapi from '@hapi/hapi';
import { logger } from './util/logger';

import { config } from './config';
import health from './handlers/health';
import { mainDataSource } from './data-source';

export const makeServer = async () => {
  const serverConfig = config.get('server');
  const server = Hapi.server(serverConfig);

  await server.register(health);

  return server;
};

const init = async () => {
  await mainDataSource.initialize();
  const server = await makeServer();

  await server.start();

  server.events.on('response', (request) => {
    logger.debug({
      action: 'response',
      method: request.method.toUpperCase(),
      path: request.path,
      response: 'statusCode' in request.response ? request.response.statusCode : null,
    });
  });

  logger.debug({
    action: 'init',
    message: 'Server running',
    uri: server.info.uri,
  });
};

process.on('unhandledRejection', (error) => {
  logger.error({
    action: 'unhandledRejection',
    error,
  });
});

void init();
