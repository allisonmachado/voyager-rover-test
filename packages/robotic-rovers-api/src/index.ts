import 'reflect-metadata';

import * as Hapi from '@hapi/hapi';
import Inert from '@hapi/inert';
import Vision from '@hapi/vision';
import HapiSwagger from 'hapi-swagger';

import health from './handlers/health';
import plateau from './handlers/plateau';
import roboticRover from './handlers/robotic-rover';

import { logger } from './util/logger';
import { config } from './config';
import { initializeDatabase } from './data-source';

process.on('unhandledRejection', (error) => {
  logger.error({ action: 'unhandledRejection', error });
});

const startApplication = async () => {
  await initializeDatabase();

  const application = config.get('application');
  const environment = config.get('env');
  const serverConfig = config.get('server');
  const server = Hapi.server(serverConfig);

  const swaggerOptions = {
    info: {
      title: `${application.name}:${environment}`,
      version: process.env.npm_package_version,
    },
  };

  await server.register(health);
  await server.register(plateau);
  await server.register(roboticRover);
  await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);
  await server.start();

  server.events.on('response', (request) => {
    logger.debug({
      action: 'serverOnResponse',
      method: request.method.toUpperCase(),
      path: request.path,
      response: 'statusCode' in request.response ? request.response.statusCode : null,
    });
  });

  logger.debug({
    action: 'startApplication',
    message: 'API service running',
    uri: server.info.uri,
    config: config.toString(),
  });
};

void startApplication();
