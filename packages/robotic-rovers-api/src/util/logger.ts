import bunyan, { LogLevelString } from 'bunyan';
import { config } from '../config';

const bunyanConfig = config.get('bunyan');
const env = config.get('env');

const logger = bunyan.createLogger({
  name: `${env}-${bunyanConfig.name}`,
  version: process.env.npm_package_version,
  level: bunyanConfig.level as LogLevelString,
  streams: [{ stream: process.stdout, level: bunyanConfig.level as LogLevelString, type: undefined }],
  serializers: { error: bunyan.stdSerializers.err },
});

export { logger };
