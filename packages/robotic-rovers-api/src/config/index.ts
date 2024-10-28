import convict from 'convict';

export const config = convict({
  application: {
    name: {
      doc: 'The application name.',
      format: String,
      default: 'robotic-rovers-api',
      env: 'APPLICATION_NAME',
    },
  },
  env: {
    doc: 'The API environment.',
    format: ['production', 'staging', 'development'],
    default: 'development',
    env: 'NODE_ENV',
  },
  server: {
    host: {
      doc: 'The IP address to bind.',
      format: String,
      default: '0.0.0.0',
      env: 'SERVER_HOST',
    },
    port: {
      doc: 'The port to bind.',
      format: Number,
      default: 3000,
      env: 'SERVER_PORT',
    },
  },
  bunyan: {
    name: {
      doc: 'The logger name.',
      format: String,
      default: 'robotic-rovers-api-logger',
      env: 'BUNYAN_NAME',
    },
    level: {
      doc: 'The logger level.',
      format: ['trace', 'debug', 'info', 'warn', 'error', 'fatal'],
      default: 'debug',
      env: 'BUNYAN_LEVEL',
    },
  },
});
