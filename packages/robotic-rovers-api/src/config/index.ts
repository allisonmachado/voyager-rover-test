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
  database: {
    main: {
      host: {
        doc: 'database hostname',
        format: String,
        env: 'MOBIETRAIN_API_DB_HOST',
        default: '127.0.0.1',
      },
      port: {
        doc: 'database connection port',
        format: Number,
        env: 'MOBIETRAIN_API_DB_PORT',
        default: 3306,
      },
      database: {
        doc: 'database schema',
        format: String,
        env: 'MOBIETRAIN_API_DB_DATABASE',
        default: 'robotic-rovers',
      },
      user: {
        doc: 'database user',
        format: String,
        env: 'MOBIETRAIN_API_DB_USER',
        default: 'root',
      },
      password: {
        doc: 'database password',
        format: String,
        env: 'MOBIETRAIN_API_DB_PASSWORD',
        default: '123456',
        sensitive: true,
      },
    },
    pool: {
      min: {
        doc: 'minimum number of connection with the database',
        format: Number,
        env: 'MOBIETRAIN_API_DB_POOL_MIN',
        default: 0,
      },
      max: {
        doc: 'maximum number of connection with the database',
        format: Number,
        env: 'MOBIETRAIN_API_DB_POOL_MAX',
        default: 30,
      },
    },
  },
});
